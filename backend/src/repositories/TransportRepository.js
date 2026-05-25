const BaseRepository = require('./BaseRepository');
const db = require('../config/database');

class TransportRepository extends BaseRepository {
  constructor() {
    super('transport_requests');
  }

  async findNearbyOpen({ longitude, latitude, radiusMeters = 10000, destinationId, limit = 20, offset = 0 }) {
    const rows = await db.raw(`
      SELECT
        tr.*,
        u.name AS organizer_name,
        u.avatar_url AS organizer_avatar,
        u.rating AS organizer_rating,
        d.name AS destination_name,
        d.city AS destination_city,
        d.country AS destination_country,
        ST_Distance(tr.pickup_location, ST_MakePoint(?, ?)::geography) AS distance_meters,
        (tr.seats_total - tr.seats_available) AS seats_taken,
        COUNT(tm.id) AS confirmed_participants
      FROM transport_requests tr
      JOIN users u ON u.id = tr.user_id
      JOIN destinations d ON d.id = tr.destination_id
      LEFT JOIN transport_matches tm ON tm.request_id = tr.id AND tm.status = 'confirmed'
      WHERE tr.status = 'open'
        AND tr.departure_time > NOW()
        AND tr.seats_available > 0
        ${destinationId ? 'AND tr.destination_id = ?' : ''}
        ${longitude && latitude ? 'AND ST_DWithin(tr.pickup_location, ST_MakePoint(?, ?)::geography, ?)' : ''}
      GROUP BY tr.id, u.name, u.avatar_url, u.rating, d.name, d.city, d.country
      ORDER BY distance_meters ASC, tr.departure_time ASC
      LIMIT ? OFFSET ?
    `, [
      longitude, latitude,
      ...(destinationId ? [destinationId] : []),
      ...(longitude && latitude ? [longitude, latitude, radiusMeters] : []),
      limit,
      offset,
    ]);
    return rows.rows;
  }

  findWithDetails(requestId) {
    return db('transport_requests as tr')
      .join('users as u', 'u.id', 'tr.user_id')
      .join('destinations as d', 'd.id', 'tr.destination_id')
      .where('tr.id', requestId)
      .select(
        'tr.*',
        'u.name as organizer_name', 'u.avatar_url as organizer_avatar', 'u.rating as organizer_rating',
        'd.name as destination_name', 'd.city as destination_city', 'd.country as destination_country'
      )
      .first();
  }

  async getParticipants(requestId) {
    return db('transport_matches as tm')
      .join('users as u', 'u.id', 'tm.user_id')
      .where({ 'tm.request_id': requestId, 'tm.status': 'confirmed' })
      .select('u.id', 'u.name', 'u.avatar_url', 'u.rating', 'tm.seats_reserved', 'tm.joined_at');
  }

  async decrementSeats(requestId, seats = 1) {
    return db('transport_requests')
      .where('id', requestId)
      .decrement('seats_available', seats)
      .update({ updated_at: new Date() });
  }

  async incrementSeats(requestId, seats = 1) {
    return db('transport_requests')
      .where('id', requestId)
      .increment('seats_available', seats)
      .update({ updated_at: new Date() });
  }

  async autoUpdateStatus(requestId) {
    await db.raw(`
      UPDATE transport_requests
      SET status = CASE
        WHEN seats_available = 0 THEN 'full'
        WHEN departure_time < NOW() THEN 'departed'
        ELSE 'open'
      END
      WHERE id = ?
    `, [requestId]);
  }
}

module.exports = new TransportRepository();

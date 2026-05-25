const db = require('../config/database');
const DestinationRepository = require('../repositories/DestinationRepository');
const { validateCoordinates, validateRadius } = require('../utils/geoUtils');
const AppError = require('../utils/AppError');

class DiscoverService {
  async getNearbyUsers({ lat, lng, radius, destinationId, currentUserId }) {
    const { latitude, longitude } = validateCoordinates(lat, lng);
    const radiusMeters = validateRadius(radius);

    const rows = await db.raw(`
      SELECT
        u.id, u.name, u.avatar_url, u.rating, u.total_reviews, u.languages, u.nationality,
        ul.destination_id,
        d.name AS destination_name, d.city AS destination_city,
        ST_Distance(ul.location, ST_MakePoint(?, ?)::geography) AS distance_meters
      FROM user_locations ul
      JOIN users u ON u.id = ul.user_id
      LEFT JOIN destinations d ON d.id = ul.destination_id
      WHERE ul.is_location_sharing = true
        AND ul.updated_at > NOW() - INTERVAL '15 minutes'
        AND u.id != ?
        AND ST_DWithin(ul.location, ST_MakePoint(?, ?)::geography, ?)
        ${destinationId ? 'AND ul.destination_id = ?' : ''}
      ORDER BY distance_meters ASC
      LIMIT 50
    `, [
      longitude, latitude,
      currentUserId,
      longitude, latitude, radiusMeters,
      ...(destinationId ? [destinationId] : []),
    ]);

    return rows.rows;
  }

  async updateUserLocation({ userId, latitude, longitude, destinationId, isSharing = true }) {
    validateCoordinates(latitude, longitude);

    const existing = await db('user_locations').where({ user_id: userId }).first();
    const locationData = {
      is_location_sharing: isSharing,
      destination_id: destinationId || null,
      updated_at: new Date(),
    };

    if (existing) {
      await db('user_locations').where({ user_id: userId }).update(locationData);
      await db.raw(
        'UPDATE user_locations SET location = ST_MakePoint(?, ?)::geography WHERE user_id = ?',
        [longitude, latitude, userId]
      );
    } else {
      await db('user_locations').insert({ ...locationData, user_id: userId });
      await db.raw(
        'UPDATE user_locations SET location = ST_MakePoint(?, ?)::geography WHERE user_id = ?',
        [longitude, latitude, userId]
      );
    }
  }

  searchDestinations(query) {
    if (!query || query.trim().length < 2) throw AppError.badRequest('Query must be at least 2 characters');
    return DestinationRepository.search(query.trim());
  }
}

module.exports = new DiscoverService();

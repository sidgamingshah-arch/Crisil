const BaseRepository = require('./BaseRepository');
const db = require('../config/database');

class ActivityRepository extends BaseRepository {
  constructor() {
    super('activities');
  }

  findByDestination(destinationId, { category, limit = 20, offset = 0 } = {}) {
    const query = db('activities')
      .where({ destination_id: destinationId, is_active: true })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
    if (category) query.where({ category });
    return query;
  }

  findBookingWithDetails(bookingId) {
    return db('activity_bookings as ab')
      .join('activities as a', 'a.id', 'ab.activity_id')
      .join('users as u', 'u.id', 'ab.organizer_user_id')
      .where('ab.id', bookingId)
      .select('ab.*', 'a.name', 'a.base_price', 'a.discount_tiers', 'a.max_group_size',
              'a.min_group_size', 'a.currency_code', 'u.name as organizer_name')
      .first();
  }

  getBookingParticipants(bookingId) {
    return db('activity_participants as ap')
      .join('users as u', 'u.id', 'ap.user_id')
      .where({ 'ap.booking_id': bookingId })
      .select('u.id', 'u.name', 'u.avatar_url', 'u.rating', 'ap.payment_status', 'ap.joined_at');
  }

  async incrementParticipants(bookingId) {
    return db('activity_bookings')
      .where({ id: bookingId })
      .increment('current_participants', 1)
      .update({ updated_at: new Date() });
  }

  getOpenBookingsForActivity(activityId) {
    return db('activity_bookings')
      .where({ activity_id: activityId, status: 'forming' })
      .where('scheduled_at', '>', new Date())
      .orderBy('scheduled_at', 'asc');
  }
}

module.exports = new ActivityRepository();

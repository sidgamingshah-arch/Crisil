const db = require('../config/database');
const ActivityRepository = require('../repositories/ActivityRepository');
const AppError = require('../utils/AppError');

class ActivityService {
  calculateDiscount(activity, currentParticipants) {
    const tiers = Array.isArray(activity.discount_tiers) ? activity.discount_tiers : [];
    const applicableTier = tiers
      .filter((t) => t.min_participants <= currentParticipants)
      .sort((a, b) => b.min_participants - a.min_participants)[0];

    const discountPercent = applicableTier?.discount_percent ?? 0;
    const finalPrice = parseFloat((activity.base_price * (1 - discountPercent / 100)).toFixed(2));
    const nextTier = tiers.find((t) => t.min_participants > currentParticipants) ?? null;
    const spotsToNextDiscount = nextTier ? nextTier.min_participants - currentParticipants : null;

    return {
      original_price: parseFloat(activity.base_price),
      discount_percent: discountPercent,
      final_price: finalPrice,
      savings: parseFloat((activity.base_price - finalPrice).toFixed(2)),
      currency_code: activity.currency_code || 'USD',
      next_tier: nextTier,
      spots_to_next_discount: spotsToNextDiscount,
    };
  }

  async getActivities({ destinationId, category, limit = 20, offset = 0 }) {
    if (!destinationId) throw AppError.badRequest('destination_id is required');
    const activities = await ActivityRepository.findByDestination(destinationId, { category, limit: parseInt(limit), offset: parseInt(offset) });

    return activities.map((a) => {
      const openBookings = []; // hydrated separately if needed
      return {
        ...a,
        discount_preview: this.calculateDiscount(a, a.min_group_size),
      };
    });
  }

  async getActivityDetail(activityId) {
    const activity = await ActivityRepository.findById(activityId);
    if (!activity) throw AppError.notFound('Activity');
    const openBookings = await ActivityRepository.getOpenBookingsForActivity(activityId);
    return {
      ...activity,
      open_bookings: openBookings,
      discount_tiers_with_prices: (activity.discount_tiers || []).map((t) => ({
        ...t,
        price: parseFloat((activity.base_price * (1 - t.discount_percent / 100)).toFixed(2)),
      })),
    };
  }

  async createBooking({ activityId, organizerUserId, scheduledAt, notes }) {
    const activity = await ActivityRepository.findById(activityId);
    if (!activity || !activity.is_active) throw AppError.notFound('Activity');

    const [booking] = await db('activity_bookings').insert({
      activity_id: activityId,
      organizer_user_id: organizerUserId,
      scheduled_at: new Date(scheduledAt),
      current_participants: 1,
      notes,
      status: 'forming',
    }).returning('*');

    await db('activity_participants').insert({
      booking_id: booking.id,
      user_id: organizerUserId,
      payment_status: 'pending',
    });

    // Create group conversation
    const [conversation] = await db('conversations').insert({
      type: 'activity_group',
      title: `${activity.name} Group`,
      activity_booking_id: booking.id,
    }).returning('*');

    await db('conversation_participants').insert({
      conversation_id: conversation.id,
      user_id: organizerUserId,
    });

    const discount = this.calculateDiscount(activity, 1);
    return { ...booking, discount, conversation_id: conversation.id };
  }

  async joinBooking({ bookingId, userId }) {
    return db.transaction(async (trx) => {
      const booking = await trx('activity_bookings').where({ id: bookingId }).forUpdate().first();
      if (!booking) throw AppError.notFound('Booking');
      if (booking.status !== 'forming') throw AppError.conflict('Booking is no longer open');

      const activity = await trx('activities').where({ id: booking.activity_id }).first();
      if (booking.current_participants >= activity.max_group_size) {
        throw AppError.conflict('Activity group is full', 'GROUP_FULL');
      }

      const existing = await trx('activity_participants').where({ booking_id: bookingId, user_id: userId }).first();
      if (existing) throw AppError.conflict('Already joined this activity', 'ALREADY_JOINED');

      await trx('activity_participants').insert({
        booking_id: bookingId,
        user_id: userId,
        payment_status: 'pending',
      });

      const [updated] = await trx('activity_bookings')
        .where({ id: bookingId })
        .increment('current_participants', 1)
        .update({ updated_at: new Date() })
        .returning('*');

      const conversation = await trx('conversations')
        .where({ activity_booking_id: bookingId, type: 'activity_group' })
        .first();
      if (conversation) {
        await trx('conversation_participants')
          .insert({ conversation_id: conversation.id, user_id: userId })
          .onConflict(['conversation_id', 'user_id']).ignore();
      }

      const discount = this.calculateDiscount(activity, updated.current_participants);
      return { booking: updated, discount };
    });
  }

  async getDiscountPreview(bookingId) {
    const booking = await ActivityRepository.findBookingWithDetails(bookingId);
    if (!booking) throw AppError.notFound('Booking');
    return {
      booking_id: bookingId,
      current_participants: booking.current_participants,
      ...this.calculateDiscount(booking, booking.current_participants),
    };
  }
}

module.exports = new ActivityService();

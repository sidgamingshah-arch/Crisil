const db = require('../config/database');
const UserRepository = require('../repositories/UserRepository');
const ReviewRepository = require('../repositories/ReviewRepository');
const AppError = require('../utils/AppError');

class ProfileService {
  async getPublicProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) throw AppError.notFound('User');
    const { firebase_uid, email, phone, fcm_token, ...publicFields } = user;
    return publicFields;
  }

  async getReviews(userId, pagination) {
    return ReviewRepository.getForUser(userId, pagination);
  }

  async submitReview({ reviewerId, revieweeId, rating, comment, tripContext, transportRequestId, activityBookingId }) {
    if (reviewerId === revieweeId) throw AppError.badRequest('Cannot review yourself');

    // Verify the reviewer was actually in a shared trip with the reviewee
    if (tripContext === 'transport' && transportRequestId) {
      const [r1, r2] = await Promise.all([
        db('transport_matches').where({ request_id: transportRequestId, user_id: revieweeId, status: 'confirmed' }).first(),
        db.raw(`SELECT 1 FROM transport_requests WHERE id = ? AND user_id = ?`, [transportRequestId, revieweeId])
          .then((r) => r.rows[0]),
      ]);
      const revieweeWasOnTrip = r1 || r2;

      const reviewerWasOnTrip = await db('transport_matches')
        .where({ request_id: transportRequestId, user_id: reviewerId, status: 'confirmed' }).first()
        || await db.raw(`SELECT 1 FROM transport_requests WHERE id = ? AND user_id = ?`, [transportRequestId, reviewerId])
          .then((r) => r.rows[0]);

      if (!revieweeWasOnTrip || !reviewerWasOnTrip) {
        throw AppError.forbidden('You can only review users from shared trips');
      }
    }

    const [review] = await db('reviews').insert({
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      rating,
      comment,
      trip_context: tripContext,
      transport_request_id: transportRequestId || null,
      activity_booking_id: activityBookingId || null,
    }).returning('*');

    await UserRepository.updateRating(revieweeId);
    return review;
  }
}

module.exports = new ProfileService();

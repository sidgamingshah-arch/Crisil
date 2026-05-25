const BaseRepository = require('./BaseRepository');
const db = require('../config/database');

class ReviewRepository extends BaseRepository {
  constructor() {
    super('reviews');
  }

  getForUser(revieweeId, { limit = 20, offset = 0 } = {}) {
    return db('reviews as r')
      .join('users as u', 'u.id', 'r.reviewer_id')
      .where('r.reviewee_id', revieweeId)
      .select(
        'r.id', 'r.rating', 'r.comment', 'r.trip_context', 'r.created_at',
        'u.id as reviewer_id', 'u.name as reviewer_name', 'u.avatar_url as reviewer_avatar'
      )
      .orderBy('r.created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }
}

module.exports = new ReviewRepository();

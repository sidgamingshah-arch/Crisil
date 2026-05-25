const BaseRepository = require('./BaseRepository');
const db = require('../config/database');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  findByFirebaseUid(firebaseUid) {
    return db('users').where({ firebase_uid: firebaseUid }).first();
  }

  findByEmail(email) {
    return db('users').where({ email }).first();
  }

  async updateRating(userId) {
    const [{ avg, count }] = await db('reviews')
      .where({ reviewee_id: userId })
      .select(db.raw('AVG(rating)::decimal(3,2) as avg, COUNT(*) as count'));
    await db('users')
      .where({ id: userId })
      .update({ rating: parseFloat(avg) || 0, total_reviews: parseInt(count) || 0 });
  }

  async updateFcmToken(userId, fcmToken) {
    return db('users').where({ id: userId }).update({ fcm_token: fcmToken });
  }
}

module.exports = new UserRepository();

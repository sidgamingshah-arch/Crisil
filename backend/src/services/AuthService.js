const UserRepository = require('../repositories/UserRepository');
const AppError = require('../utils/AppError');

class AuthService {
  async register({ firebaseUid, name, email, preferredLanguage = 'en' }) {
    const existing = await UserRepository.findByFirebaseUid(firebaseUid);
    if (existing) return existing;

    return UserRepository.create({
      firebase_uid: firebaseUid,
      name,
      email,
      preferred_language: preferredLanguage,
    });
  }

  async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) throw AppError.notFound('User');
    return user;
  }

  async updateProfile(userId, updates) {
    const allowed = ['name', 'bio', 'languages', 'nationality', 'phone', 'preferred_language', 'avatar_url'];
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowed.includes(k))
    );
    if (!Object.keys(filtered).length) throw AppError.badRequest('No valid fields to update');
    return UserRepository.update(userId, filtered);
  }

  async updateFcmToken(userId, fcmToken) {
    return UserRepository.updateFcmToken(userId, fcmToken);
  }
}

module.exports = new AuthService();

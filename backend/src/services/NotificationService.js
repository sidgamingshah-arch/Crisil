const { getAdmin } = require('../config/firebase');
const UserRepository = require('../repositories/UserRepository');
const logger = require('../utils/logger');

class NotificationService {
  async sendToUser(userId, { title, body, data = {} }) {
    const user = await UserRepository.findById(userId);
    if (!user?.fcm_token) return null;
    return this.sendToToken(user.fcm_token, { title, body, data });
  }

  async sendToToken(fcmToken, { title, body, data = {} }) {
    const admin = getAdmin();
    if (!admin) {
      logger.debug('FCM not configured — skipping notification', { title });
      return null;
    }
    try {
      const result = await admin.messaging().send({
        token: fcmToken,
        notification: { title, body },
        data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
        android: { priority: 'high' },
        apns: { payload: { aps: { sound: 'default', badge: 1 } } },
      });
      return result;
    } catch (err) {
      logger.warn('FCM send failed', { token: fcmToken, error: err.message });
      return null;
    }
  }

  async notifyTransportJoined(requestOwnerId, joinerName) {
    return this.sendToUser(requestOwnerId, {
      title: 'New traveler joined your trip!',
      body: `${joinerName} joined your shared transport.`,
      data: { type: 'TRANSPORT_JOINED' },
    });
  }

  async notifyNewMessage(recipientId, senderName, conversationId) {
    return this.sendToUser(recipientId, {
      title: senderName,
      body: 'Sent you a message',
      data: { type: 'NEW_MESSAGE', conversation_id: conversationId },
    });
  }

  async notifyActivityDiscount(participantId, activityName, newPrice) {
    return this.sendToUser(participantId, {
      title: 'Price dropped!',
      body: `${activityName} is now $${newPrice} as more people joined!`,
      data: { type: 'ACTIVITY_DISCOUNT' },
    });
  }
}

module.exports = new NotificationService();

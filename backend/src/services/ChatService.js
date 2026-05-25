const db = require('../config/database');
const ConversationRepository = require('../repositories/ConversationRepository');
const AppError = require('../utils/AppError');

class ChatService {
  async getUserConversations(userId, pagination) {
    const conversations = await ConversationRepository.getUserConversations(userId, pagination);
    return Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await ConversationRepository.getLastMessage(conv.id);
        const unreadCount = await ConversationRepository.getUnreadCount(conv.id, userId);
        return { ...conv, last_message: lastMessage, unread_count: unreadCount };
      })
    );
  }

  async getOrCreateDirectConversation(userId1, userId2) {
    const existing = await ConversationRepository.findDirectConversation(userId1, userId2);
    if (existing) return existing;

    return db.transaction(async (trx) => {
      const [conv] = await trx('conversations').insert({ type: 'direct' }).returning('*');
      await trx('conversation_participants').insert([
        { conversation_id: conv.id, user_id: userId1 },
        { conversation_id: conv.id, user_id: userId2 },
      ]);
      return conv;
    });
  }

  async getMessages(conversationId, userId, { limit = 50, before } = {}) {
    const isMember = await ConversationRepository.isParticipant(conversationId, userId);
    if (!isMember) throw AppError.forbidden('Not a participant of this conversation');

    const messages = await ConversationRepository.getMessages(conversationId, { limit: parseInt(limit), before });
    await ConversationRepository.markRead(conversationId, userId);
    return messages.reverse(); // oldest first
  }

  async sendMessage({ conversationId, senderId, content, type = 'text', metadata }) {
    const isMember = await ConversationRepository.isParticipant(conversationId, senderId);
    if (!isMember) throw AppError.forbidden('Not a participant of this conversation');
    if (!content?.trim()) throw AppError.badRequest('Message content cannot be empty');

    const [message] = await db('messages').insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content.trim(),
      type,
      metadata: metadata ? JSON.stringify(metadata) : null,
    }).returning('*');

    const sender = await db('users').where({ id: senderId }).select('name', 'avatar_url').first();
    return { ...message, sender_name: sender.name, sender_avatar: sender.avatar_url };
  }

  async markRead(conversationId, userId) {
    const isMember = await ConversationRepository.isParticipant(conversationId, userId);
    if (!isMember) throw AppError.forbidden();
    return ConversationRepository.markRead(conversationId, userId);
  }

  async getConversationParticipants(conversationId, userId) {
    const isMember = await ConversationRepository.isParticipant(conversationId, userId);
    if (!isMember) throw AppError.forbidden();
    return db('conversation_participants as cp')
      .join('users as u', 'u.id', 'cp.user_id')
      .where('cp.conversation_id', conversationId)
      .select('u.id', 'u.name', 'u.avatar_url', 'u.rating', 'cp.joined_at');
  }
}

module.exports = new ChatService();

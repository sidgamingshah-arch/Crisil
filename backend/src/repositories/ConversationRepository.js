const BaseRepository = require('./BaseRepository');
const db = require('../config/database');

class ConversationRepository extends BaseRepository {
  constructor() {
    super('conversations');
  }

  getUserConversations(userId, { limit = 20, offset = 0 } = {}) {
    return db('conversations as c')
      .join('conversation_participants as cp', 'cp.conversation_id', 'c.id')
      .where('cp.user_id', userId)
      .leftJoin(
        db('messages').select('conversation_id').max('created_at as last_message_at').groupBy('conversation_id').as('lm'),
        'lm.conversation_id', 'c.id'
      )
      .select(
        'c.id', 'c.type', 'c.title', 'c.created_at',
        'cp.last_read_at',
        'lm.last_message_at'
      )
      .orderBy('lm.last_message_at', 'desc')
      .limit(limit)
      .offset(offset);
  }

  getLastMessage(conversationId) {
    return db('messages as m')
      .join('users as u', 'u.id', 'm.sender_id')
      .where('m.conversation_id', conversationId)
      .select('m.id', 'm.content', 'm.type', 'm.created_at', 'u.name as sender_name')
      .orderBy('m.created_at', 'desc')
      .first();
  }

  getMessages(conversationId, { limit = 50, before } = {}) {
    const query = db('messages as m')
      .join('users as u', 'u.id', 'm.sender_id')
      .where('m.conversation_id', conversationId)
      .select('m.*', 'u.name as sender_name', 'u.avatar_url as sender_avatar')
      .orderBy('m.created_at', 'desc')
      .limit(limit);
    if (before) query.where('m.created_at', '<', before);
    return query;
  }

  isParticipant(conversationId, userId) {
    return db('conversation_participants')
      .where({ conversation_id: conversationId, user_id: userId })
      .first();
  }

  async markRead(conversationId, userId) {
    return db('conversation_participants')
      .where({ conversation_id: conversationId, user_id: userId })
      .update({ last_read_at: new Date() });
  }

  async getUnreadCount(conversationId, userId) {
    const participant = await db('conversation_participants')
      .where({ conversation_id: conversationId, user_id: userId })
      .first();
    if (!participant) return 0;
    const [{ count }] = await db('messages')
      .where('conversation_id', conversationId)
      .where('created_at', '>', participant.last_read_at)
      .whereNot('sender_id', userId)
      .count('id as count');
    return parseInt(count);
  }

  findDirectConversation(userId1, userId2) {
    return db.raw(`
      SELECT c.id FROM conversations c
      JOIN conversation_participants cp1 ON cp1.conversation_id = c.id AND cp1.user_id = ?
      JOIN conversation_participants cp2 ON cp2.conversation_id = c.id AND cp2.user_id = ?
      WHERE c.type = 'direct'
      LIMIT 1
    `, [userId1, userId2]).then((r) => r.rows[0]);
  }
}

module.exports = new ConversationRepository();

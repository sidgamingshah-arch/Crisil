const ChatService = require('../services/ChatService');
const NotificationService = require('../services/NotificationService');
const ConversationRepository = require('../repositories/ConversationRepository');
const logger = require('../utils/logger');

module.exports = function chatHandler(io, socket) {
  socket.on('join_room', async ({ conversation_id }) => {
    try {
      const isMember = await ConversationRepository.isParticipant(conversation_id, socket.userId);
      if (!isMember) return socket.emit('error', { message: 'Not a participant' });
      socket.join(`conv:${conversation_id}`);
      socket.emit('room_joined', { conversation_id });
    } catch (err) {
      logger.error('join_room error', { err: err.message });
    }
  });

  socket.on('leave_room', ({ conversation_id }) => {
    socket.leave(`conv:${conversation_id}`);
  });

  socket.on('send_message', async ({ conversation_id, content, type = 'text', metadata }) => {
    try {
      const message = await ChatService.sendMessage({
        conversationId: conversation_id,
        senderId: socket.userId,
        content,
        type,
        metadata,
      });

      io.to(`conv:${conversation_id}`).emit('receive_message', message);

      // Push notifications to offline participants
      const participants = await ConversationRepository.isParticipant(conversation_id, socket.userId);
      const allParticipants = await require('../config/database')('conversation_participants')
        .where({ conversation_id })
        .whereNot('user_id', socket.userId)
        .pluck('user_id');

      allParticipants.forEach((userId) => {
        const room = `user:${userId}`;
        const isOnline = io.sockets.adapter.rooms.has(room);
        if (!isOnline) {
          NotificationService.notifyNewMessage(userId, socket.userName, conversation_id).catch(() => {});
        }
      });
    } catch (err) {
      logger.error('send_message error', { err: err.message });
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('message_read', async ({ conversation_id }) => {
    try {
      await ChatService.markRead(conversation_id, socket.userId);
      socket.to(`conv:${conversation_id}`).emit('messages_read', {
        user_id: socket.userId,
        conversation_id,
        read_at: new Date().toISOString(),
      });
    } catch (err) {
      logger.error('message_read error', { err: err.message });
    }
  });

  socket.on('typing_start', ({ conversation_id }) => {
    socket.to(`conv:${conversation_id}`).emit('typing_start', {
      user_id: socket.userId,
      user_name: socket.userName,
      conversation_id,
    });
  });

  socket.on('typing_stop', ({ conversation_id }) => {
    socket.to(`conv:${conversation_id}`).emit('typing_stop', {
      user_id: socket.userId,
      conversation_id,
    });
  });
};

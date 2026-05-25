const ChatService = require('../services/ChatService');
const asyncHandler = require('../utils/asyncHandler');
const { parsePagination } = require('../utils/pagination');

const getConversations = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query);
  const conversations = await ChatService.getUserConversations(req.user.id, pagination);
  res.json({ success: true, data: conversations });
});

const createConversation = asyncHandler(async (req, res) => {
  const { target_user_id } = req.body;
  const conversation = await ChatService.getOrCreateDirectConversation(req.user.id, target_user_id);
  res.status(201).json({ success: true, data: conversation });
});

const getMessages = asyncHandler(async (req, res) => {
  const messages = await ChatService.getMessages(req.params.id, req.user.id, req.query);
  res.json({ success: true, data: messages });
});

const sendMessage = asyncHandler(async (req, res) => {
  const message = await ChatService.sendMessage({
    conversationId: req.params.id,
    senderId: req.user.id,
    content: req.body.content,
    type: req.body.type,
    metadata: req.body.metadata,
  });
  res.status(201).json({ success: true, data: message });
});

const markRead = asyncHandler(async (req, res) => {
  await ChatService.markRead(req.params.id, req.user.id);
  res.json({ success: true });
});

const getParticipants = asyncHandler(async (req, res) => {
  const participants = await ChatService.getConversationParticipants(req.params.id, req.user.id);
  res.json({ success: true, data: participants });
});

module.exports = { getConversations, createConversation, getMessages, sendMessage, markRead, getParticipants };

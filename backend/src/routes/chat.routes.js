const router = require('express').Router();
const ChatController = require('../controllers/ChatController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const v = require('../validators/chat.validator');

router.use(authMiddleware);
router.get('/', ChatController.getConversations);
router.post('/', validate(v.createConversation), ChatController.createConversation);
router.get('/:id/messages', validate(v.messagesQuery, 'query'), ChatController.getMessages);
router.post('/:id/messages', validate(v.sendMessage), ChatController.sendMessage);
router.put('/:id/read', ChatController.markRead);
router.get('/:id/participants', ChatController.getParticipants);

module.exports = router;

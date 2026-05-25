const router = require('express').Router();
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');
const v = require('../validators/auth.validator');

router.post('/register', rateLimiter.auth, validate(v.register), AuthController.register);
router.get('/me', authMiddleware, AuthController.getMe);
router.get('/users/:id', authMiddleware, AuthController.getUser);
router.put('/users/:id', authMiddleware, validate(v.updateProfile), AuthController.updateProfile);
router.post('/users/fcm-token', authMiddleware, validate(v.updateFcm), AuthController.updateFcmToken);

module.exports = router;

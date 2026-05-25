const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/discover', require('./discover.routes'));
router.use('/transport', require('./transport.routes'));
router.use('/activities', require('./activity.routes'));
router.use('/chat', require('./chat.routes'));
router.use('/profiles', require('./profile.routes'));

router.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

module.exports = router;

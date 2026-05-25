const router = require('express').Router();
const DiscoverController = require('../controllers/DiscoverController');
const authMiddleware = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

router.use(authMiddleware);
router.get('/nearby', DiscoverController.getNearbyUsers);
router.post('/location', rateLimiter.location, DiscoverController.updateLocation);
router.get('/destinations', DiscoverController.searchDestinations);

module.exports = router;

const router = require('express').Router();
const ActivityController = require('../controllers/ActivityController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const v = require('../validators/activity.validator');

router.use(authMiddleware);
router.get('/', validate(v.listQuery, 'query'), ActivityController.listActivities);
router.get('/:id', ActivityController.getDetail);
router.post('/:id/bookings', validate(v.createBooking), ActivityController.createBooking);
router.get('/bookings/:bookingId/discount-preview', ActivityController.getDiscountPreview);
router.post('/bookings/:bookingId/join', ActivityController.joinBooking);

module.exports = router;

const router = require('express').Router();
const ProfileController = require('../controllers/ProfileController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const v = require('../validators/review.validator');

router.use(authMiddleware);
router.get('/:id', ProfileController.getProfile);
router.get('/:id/reviews', ProfileController.getReviews);
router.post('/reviews', validate(v.submitReview), ProfileController.submitReview);

module.exports = router;

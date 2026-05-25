const router = require('express').Router();
const TransportController = require('../controllers/TransportController');
const authMiddleware = require('../middleware/auth');
const validate = require('../middleware/validate');
const v = require('../validators/transport.validator');

router.use(authMiddleware);
router.post('/', validate(v.createRequest), TransportController.createRequest);
router.get('/nearby', validate(v.nearbyQuery, 'query'), TransportController.getNearby);
router.get('/:id', TransportController.getDetail);
router.post('/:id/join', validate(v.joinRequest), TransportController.joinRequest);
router.delete('/:id/leave', TransportController.leaveRequest);
router.delete('/:id', TransportController.cancelRequest);

module.exports = router;

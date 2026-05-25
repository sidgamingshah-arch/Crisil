const logger = require('../utils/logger');
const ActivityService = require('../services/ActivityService');

module.exports = function matchingHandler(io, socket) {
  // Subscribe to transport request updates
  socket.on('subscribe_transport', ({ request_id }) => {
    socket.join(`transport:${request_id}`);
  });

  socket.on('unsubscribe_transport', ({ request_id }) => {
    socket.leave(`transport:${request_id}`);
  });

  // Subscribe to activity booking updates (for live discount meter)
  socket.on('subscribe_activity_booking', ({ booking_id }) => {
    socket.join(`booking:${booking_id}`);
  });

  socket.on('unsubscribe_activity_booking', ({ booking_id }) => {
    socket.leave(`booking:${booking_id}`);
  });
};

// Exported helpers called from services to broadcast events
function broadcastTransportJoined(io, requestId, matchData) {
  io.to(`transport:${requestId}`).emit('transport_request_joined', {
    request_id: requestId,
    ...matchData,
  });
}

async function broadcastActivityDiscountUpdate(io, bookingId) {
  try {
    const preview = await ActivityService.getDiscountPreview(bookingId);
    io.to(`booking:${bookingId}`).emit('activity_booking_updated', preview);
  } catch (err) {
    logger.error('broadcastActivityDiscountUpdate error', { err: err.message });
  }
}

module.exports.broadcastTransportJoined = broadcastTransportJoined;
module.exports.broadcastActivityDiscountUpdate = broadcastActivityDiscountUpdate;

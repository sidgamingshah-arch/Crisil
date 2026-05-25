const DiscoverService = require('../services/DiscoverService');
const logger = require('../utils/logger');

module.exports = function locationHandler(io, socket) {
  socket.on('update_location', async ({ latitude, longitude, destination_id, is_sharing = true }) => {
    try {
      await DiscoverService.updateUserLocation({
        userId: socket.userId,
        latitude,
        longitude,
        destinationId: destination_id,
        isSharing: is_sharing,
      });

      if (is_sharing) {
        // Broadcast to a nearby "region" room for live map updates
        const regionKey = `region:${Math.floor(latitude)}_${Math.floor(longitude)}`;
        socket.join(regionKey);
        socket.to(regionKey).emit('nearby_user_updated', {
          user_id: socket.userId,
          latitude,
          longitude,
          destination_id,
        });
      }

      socket.emit('location_updated', { success: true });
    } catch (err) {
      logger.error('update_location error', { err: err.message });
      socket.emit('error', { message: err.message });
    }
  });

  socket.on('stop_sharing_location', async () => {
    try {
      await DiscoverService.updateUserLocation({
        userId: socket.userId,
        latitude: 0,
        longitude: 0,
        isSharing: false,
      });
      socket.emit('location_sharing_stopped');
    } catch (err) {
      logger.error('stop_sharing_location error', { err: err.message });
    }
  });
};

const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const { getAdmin } = require('../config/firebase');
const UserRepository = require('../repositories/UserRepository');
const logger = require('../utils/logger');
const chatHandler = require('./chatHandler');
const locationHandler = require('./locationHandler');
const matchingHandler = require('./matchingHandler');

let ioInstance;

async function initSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Redis adapter for multi-process scaling
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    logger.info('Socket.io Redis adapter initialized');
  } catch (err) {
    logger.warn('Redis adapter failed, using in-memory adapter', { err: err.message });
  }

  // Auth middleware for every socket connection
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const admin = getAdmin();
      let userId;

      if (admin) {
        const decoded = await admin.auth().verifyIdToken(token);
        const user = await UserRepository.findByFirebaseUid(decoded.uid);
        if (!user) return next(new Error('User not registered'));
        socket.userId = user.id;
        socket.userName = user.name;
      } else if (process.env.NODE_ENV !== 'production' && token.startsWith('test_')) {
        const uid = token.replace('test_', '');
        const user = await UserRepository.findOne({ firebase_uid: uid });
        if (!user) return next(new Error('Test user not found'));
        socket.userId = user.id;
        socket.userName = user.name;
      } else {
        return next(new Error('Firebase not configured'));
      }

      next();
    } catch (err) {
      logger.warn('Socket auth failed', { err: err.message });
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    logger.debug('Socket connected', { userId: socket.userId, socketId: socket.id });
    socket.join(`user:${socket.userId}`);

    chatHandler(io, socket);
    locationHandler(io, socket);
    matchingHandler(io, socket);

    socket.on('disconnect', (reason) => {
      logger.debug('Socket disconnected', { userId: socket.userId, reason });
    });
  });

  ioInstance = io;
  return io;
}

function getIo() {
  return ioInstance;
}

module.exports = { initSockets, getIo };

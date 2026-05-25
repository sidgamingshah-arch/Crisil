const db = require('./database');
const { getRedisClient, closeRedis } = require('./redis');
const { initFirebase, getAdmin } = require('./firebase');

module.exports = { db, getRedisClient, closeRedis, initFirebase, getAdmin };

const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { getAdmin } = require('../config/firebase');
const db = require('../config/database');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Missing or invalid Authorization header');
  }

  const token = authHeader.split('Bearer ')[1];

  const admin = getAdmin();
  if (!admin) {
    // Dev bypass: accept test tokens of format "test_<firebase_uid>"
    if (process.env.NODE_ENV !== 'production' && token.startsWith('test_')) {
      const uid = token.replace('test_', '');
      const user = await db('users').where({ firebase_uid: uid }).first();
      if (!user) throw AppError.unauthorized('Test user not found');
      req.user = user;
      return next();
    }
    throw AppError.internal('Firebase not configured');
  }

  let decoded;
  try {
    decoded = await admin.auth().verifyIdToken(token);
  } catch {
    throw AppError.unauthorized('Invalid or expired token');
  }

  const user = await db('users').where({ firebase_uid: decoded.uid }).first();
  if (!user) {
    throw AppError.unauthorized('User not registered. Complete profile setup.');
  }

  req.user = user;
  next();
});

module.exports = authMiddleware;

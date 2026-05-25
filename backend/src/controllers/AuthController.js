const AuthService = require('../services/AuthService');
const asyncHandler = require('../utils/asyncHandler');
const { getAdmin } = require('../config/firebase');
const AppError = require('../utils/AppError');

const register = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) throw AppError.unauthorized();
  const token = authHeader.split('Bearer ')[1];

  const admin = getAdmin();
  let decoded;
  if (admin) {
    decoded = await admin.auth().verifyIdToken(token);
  } else if (process.env.NODE_ENV !== 'production' && token.startsWith('test_')) {
    decoded = { uid: token.replace('test_', ''), email: req.body.email };
  } else {
    throw AppError.internal('Firebase not configured');
  }

  const user = await AuthService.register({
    firebaseUid: decoded.uid,
    name: req.body.name,
    email: req.body.email || decoded.email,
    preferredLanguage: req.body.preferred_language,
  });
  res.status(201).json({ success: true, data: user });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await AuthService.getProfile(req.params.id);
  res.json({ success: true, data: user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await AuthService.updateProfile(req.user.id, req.body);
  res.json({ success: true, data: user });
});

const updateFcmToken = asyncHandler(async (req, res) => {
  await AuthService.updateFcmToken(req.user.id, req.body.fcm_token);
  res.json({ success: true });
});

module.exports = { register, getMe, getUser, updateProfile, updateFcmToken };

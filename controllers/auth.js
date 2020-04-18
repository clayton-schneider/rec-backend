const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const passport = require('passport');

// Logout user
// GET /api/v1/auth/logout
// Public
exports.logout = asyncHandler(async (req, res, next) => {
  req.logout();
  res.status(200).json({ success: true, data: {} });
});

// Start oauth login with linked in
// GET /api/v1/auth/linkedin
// Public
exports.linkedin = passport.authenticate('linkedin', { prompt: 'force' });

// Linkedin redirect
// GET /api/v1/auth/linkedin/redirect
// Public
exports.linkedinRedirect = asyncHandler(async (req, res) => {
  res.redirect(`${process.env.SPA_URL}/dashboard`);
});

// Get current logged in user
// GET /api/v1/auth/me
// Private
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

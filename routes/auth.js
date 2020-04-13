const express = require('express');
const passport = require('passport');
const {
  logout,
  linkedin,
  linkedinRedirect,
  getMe,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/logout').get(logout);

router.route('/linkedin').get(linkedin);

router
  .route('/linkedin/redirect')
  .get(passport.authenticate('linkedin'), linkedinRedirect);

router.get('/me', protect, getMe);

module.exports = router;

const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');
const asyncHandler = require('../middleware/async');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id).populate('recs');
  done(null, user);
});

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_KEY,
      clientSecret: process.env.LINKEDIN_SECRET,
      callbackURL: '/api/v1/auth/linkedin/redirect',
      scope: ['r_emailaddress', 'r_liteprofile'],
    },
    async (token, secret, profile, done) => {
      const currentUser = await User.findOne({ linkedinId: profile.id });

      if (currentUser) {
        done(null, currentUser);
      } else {
        const newUser = await new User({
          linkedinId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        }).save();
        done(null, newUser);
      }
    }
  )
);

const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const axios = require('axios');

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
      let currentUser = await User.findOne({ linkedinId: profile.id });

      if (currentUser) {
        currentUser.profilePicture = await addImage(token);
        const updatedUser = await currentUser.save();
        done(null, updatedUser);
      } else {
        const profilePicture = await addImage(token);
        const newUser = await new User({
          linkedinId: profile.id,
          profilePicture,
          name: profile.displayName,
          email: profile.emails[0].value,
        }).save();
        done(null, newUser);
      }
    }
  )
);

const addImage = async token => {
  const {
    data,
  } = await axios.get(
    'https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))',
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const profilePicture =
    data.profilePicture['displayImage~'].elements[0].identifiers[0].identifier;
  return profilePicture;
};

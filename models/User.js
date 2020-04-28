const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    linkedinId: String,
    profilePicture: String,
    name: String,
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    credits: {
      type: Number,
      default: 1,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Reverse populate with virtuals
UserSchema.virtual('recs', {
  ref: 'Recs',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

module.exports = mongoose.model('Users', UserSchema);

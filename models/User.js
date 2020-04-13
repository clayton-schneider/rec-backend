const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  linkedinId: String,
  name: String,
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
});

module.exports = mongoose.model('Users', UserSchema);

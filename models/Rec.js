const mongoose = require('mongoose');

const RecSchema = new mongoose.Schema({
  authorEmail: {
    type: String,
    required: [true, "Please add the author's email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  authorName: String,
  recommendation: String,
  signature: String,
  submitted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Recs', RecSchema);

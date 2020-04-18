const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// Update user
// PUT /api/v1/user/:userId
exports.addCredit = asyncHandler(async (req, res, next) => {
  req.user.credits += 1;
  const user = req.user.save();
  res.status(200).json({ success: true, data: user });
});

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// Update user
// PUT /api/v1/user/:userId
exports.addCredit = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;

  console.log(amount);

  let credits;

  if (amount === 200) credits = 1;
  if (amount === 750) credits = 5;
  if (amount === 1000) credits = 10;

  if (!credits) return next(new ErrorResponse('Credits not defined', 400));

  req.user.credits += credits;
  const user = await req.user.save();
  res.status(200).json({ success: true, data: user });
});

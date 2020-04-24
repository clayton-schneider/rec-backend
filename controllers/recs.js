const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Rec = require('../models/Rec');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Get all recs for a user
// GET /api/v1/recs
// GET /api/v1/user/:userId/recs
// Private
exports.getRecs = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.id) {
    query = Rec.find({ user: req.params.userId });
  } else {
    query = Rec.find();
  }

  const recs = await query;

  res.status(200).json({ success: true, count: recs.length, data: recs });
});

// Get single rec
// GET /api/v1/recs/:id
// Private
exports.getRec = asyncHandler(async (req, res, next) => {
  const rec = await Rec.findById(req.params.id);

  if (!rec)
    return next(
      new ErrorResponse(`No rec with id: ${req.params.id} found`, 404)
    );

  res.status(200).json({ success: true, data: rec });
});

// Create new rec
// POST /api/v1/recs/
// Private
exports.createRec = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const rec = await Rec.create(req.body);
  let message;

  if (req.body.message) {
    message = `<p>${req.body.message}</p>
    <a href=${process.env.SPA_URL}/recommend/${rec.id}>Click Here</a>`;
  } else {
    message = `<p>Hello ${rec.authorName},
    ${req.user.name} is requesting that you write them a letter of recommendation.
    You can submit the recommendation at the below link</p>
    <a href=${process.env.SPA_URL}/recommend/${rec.id}>Click Here</a>
    `;
  }

  try {
    await sendEmail({
      email: rec.authorEmail,
      subject: `Letter of recommendation for ${req.user.name}`,
      html: message,
    });
    res.status(200).json({ success: true, data: 'email sent' });
  } catch (err) {
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// Update rec
// PUT /api/v1/recs/:id
// Private
exports.updateRec = asyncHandler(async (req, res, next) => {
  const rec = await Rec.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!rec)
    return next(
      new ErrorResponse(`No rec with id: ${req.params.id} found`, 404)
    );

  res.status(200).json({ success: true, data: rec });
});

// Delete rec
// DELETE /api/v1/recs/:id
// Private
exports.deleteRec = asyncHandler(async (req, res, next) => {
  const rec = await Rec.findByIdAndDelete(req.params.id);

  if (!rec)
    return next(
      new ErrorResponse(`No rec with id: ${req.params.id} found`, 404)
    );

  res.status(200).json({ success: true, data: {} });
});

// Send Rec
// Post /api/v1/recs/send/:id
// Private
exports.sendRec = asyncHandler(async (req, res, next) => {
  const rec = await Rec.findById(req.params.id);
  const aboutPerson = await User.findById(rec.user);
  const { toName, toEmail } = req.body;

  if (!rec)
    return next(
      new ErrorResponse(`No rec with id: ${req.params.id} found`, 404)
    );

  req.user.credits -= 1;
  await req.user.save();

  const message = `Hello ${toName},
    ${aboutPerson.name} has sent you a recommendation that was written by ${rec.authorName}.
    Recommendation: 
    ${rec.recommendation}
    signed: ${rec.signature}
    `;

  try {
    await sendEmail({
      email: toEmail,
      subject: `Letter of recommendation for ${aboutPerson.name}`,
      message,
    });
    res.status(200).json({ success: true, data: 'email sent' });
  } catch (err) {
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

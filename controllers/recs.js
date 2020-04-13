const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');
const Rec = require('../models/Rec');

// Get all recs for a user
// GET /api/v1/user/:userid/recs
// Private
exports.getRecs = asyncHandler(async (req, res, next) => {
  const recs = await Rec.find();

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
  const rec = await Rec.create(req.body);

  res.status(201).json({ success: true, data: rec });
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

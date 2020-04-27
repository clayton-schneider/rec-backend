const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { credits } = req.body;

  const price = calcCost(credits);

  if (!price) return next(new ErrorResponse('Amount not specified', 400));

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price,
    currency: 'usd',
    receipt_email: req.user.email,
  });

  res.status(200).json({
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    amount: paymentIntent.amount,
  });
});

exports.updatePaymentIntent = asyncHandler(async (req, res, next) => {
  const paymentIntent = req.params.id;
  const { newCredits } = req.body;

  const price = calcCost(newCredits);

  if (!price) return next(new ErrorResponse('Amount not specified', 400));

  const updatedIntent = await stripe.paymentIntents.update(paymentIntent, {
    amount: price,
  });

  res.status(200).json({
    id: updatedIntent.id,
    clientSecret: updatedIntent.client_secret,
    amount: updatedIntent.amount,
  });
});

const calcCost = creditsAmt => {
  let amount;
  if (creditsAmt === 1) amount = 200;
  if (creditsAmt === 5) amount = 750;
  if (creditsAmt === 10) amount = 1000;

  return amount;
};

const express = require('express');
const {
  createPaymentIntent,
  updatePaymentIntent,
} = require('../controllers/payments');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);

router.put('/update-payment-intent/:id', protect, updatePaymentIntent);

module.exports = router;

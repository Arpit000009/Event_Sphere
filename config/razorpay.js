// config/razorpay.js
const Razorpay = require('razorpay');

let razorpay = null;

// Only initialize if environment variables are present
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Razorpay:', error.message);
  }
} else {
  console.log('⚠️  Razorpay credentials not found in environment variables');
}

module.exports = razorpay;
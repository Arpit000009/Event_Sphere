const paypalClient = require('../config/paypalClient');
const paypal = require('@paypal/checkout-server-sdk');

// Create Order
exports.createOrder = async (req, res) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: '10.00' // Replace with actual event price
      }
    }]
  });

  try {
    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id }); // Send order ID to client
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating PayPal order');
  }
};

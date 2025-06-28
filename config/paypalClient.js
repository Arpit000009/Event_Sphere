// config/paypalClient.js
const paypal = require('@paypal/checkout-server-sdk');

// Set environment variables or hardcode your Sandbox keys (not recommended for production)
const clientId = process.env.PAYPAL_CLIENT_ID || 'YOUR-SANDBOX-CLIENT-ID';
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'YOUR-SANDBOX-CLIENT-SECRET';

// Create PayPal environment
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);

// Create PayPal client
const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;

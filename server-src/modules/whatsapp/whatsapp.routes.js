const express = require('express');
const WhatsAppController = require('./whatsapp.controller');

const router = express.Router();

/**
 * WhatsApp Bot API Routes for Priority Bags.
 * Note: These routes are consumed by WhatsApp Webhooks (Twilio or Meta).
 */

// Webhook for incoming WhatsApp messages
router.post('/webhook', WhatsAppController.handleWebhook);

// Status / Debugging for Bot Dashboards
router.get('/status', WhatsAppController.getStatus);

module.exports = router;

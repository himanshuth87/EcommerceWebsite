const WhatsAppService = require('./whatsapp.service');

/**
 * Controller for WhatsApp Bot Endpoints.
 * Handles incoming webhooks and logic for Priority Bags WhatsApp presence.
 */
class WhatsAppController {
  
  /**
   * Main Webhook for WhatsApp incoming messages (Standard Twilio Webhook).
   * Note: This is an example implementation using Twilio-style MessagingResponse.
   */
  async handleWebhook(req, res, next) {
    try {
      const { Body: text, From: from } = req.body;
      
      console.log(`\n📲 Incoming WhatsApp from ${from}: ${text}\n`);
      
      const responseText = await WhatsAppService.processMessage(from, text);

      // Twilio MessagingResponse XML format (Standard for WhatsApp)
      // Note: In a production environment with Meta API, this would be a JSON response or message API call.
      res.set('Content-Type', 'text/xml');
      res.send(`
        <Response>
          <Message>
            <Body>${responseText}</Body>
          </Message>
        </Response>
      `);
    } catch (err) {
      console.error('Error handling WhatsApp webhook:', err);
      // Fallback response for WhatsApp in case of server-side failure
      res.set('Content-Type', 'text/xml');
      res.send('<Response><Message><Body>⚠️ Priority Bags Bot is currently undergoing maintenance. Please try again later.</Body></Message></Response>');
    }
  }

  /**
   * Health Check / Status for WhatsApp integration.
   */
  async getStatus(req, res) {
    res.json({
      success: true,
      service: 'Priority Bags WhatsApp Bot V1',
      status: 'Ready',
      webhookUrl: `${process.env.APP_URL || 'http://localhost:3000'}/api/v1/whatsapp/webhook`,
      activeConnections: 128, // Mocked for Dashboard
      intelligenceLevel: 'AI Processing Enabled'
    });
  }
}

module.exports = new WhatsAppController();

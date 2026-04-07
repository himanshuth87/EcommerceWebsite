const { query } = require('../../../config/db');

/**
 * Service for handling WhatsApp bot logic.
 */
class WhatsAppService {
  /**
   * Process an incoming message and return a response.
   */
  async processMessage(from, text) {
    const input = text.toLowerCase().trim();

    // 1. Order Status Check
    if (input.includes('order') || input.includes('track') || input.includes('status')) {
      return await this.handleOrderTracking(input);
    }

    // 2. Product Search
    if (input.includes('show') || input.includes('product') || input.includes('buy') || input.includes('bag') || input.includes('luggage')) {
      return await this.handleProductSearch(input);
    }

    // 3. Fallback / Welcome
    return `👋 Welcome to *Priority Bags*! I am your AI shopping assistant.\n\nHow can I help you today?\n- *\"Show me bags\"*: To browse our catalog\n- *\"Track order\"*: To check your shipment status\n- *\"Talk to agent\"*: For human support`;
  }

  async handleOrderTracking(input) {
    // Extract potential order ID / email (simplified for demo)
    const emailMatch = input.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    
    if (!emailMatch) {
      return `📦 To track your order, please provide the email address used during purchase. (e.g., 'Track order for user@example.com')`;
    }

    const email = emailMatch[0];
    try {
      const orders = await query('SELECT order_id, amount, status, created_at FROM orders WHERE email = $1 ORDER BY created_at DESC LIMIT 1', [email]);
      
      if (orders.length === 0) {
        return `❌ No orders found for *${email}*. Please double-check the email address.`;
      }

      const order = orders[0];
      return `📋 *Order Status for ${email}*:\n\nOrder ID: #${order.order_id}\nAmount: ₹${order.amount}\nStatus: *${order.status.toUpperCase()}*\nPlaced On: ${new Date(order.created_at).toLocaleDateString()}\n\nIs there anything else I can help with?`;
    } catch (err) {
      console.error('Bot Order Tracking Error:', err);
      return `⚠️ Sorry, I encountered an error while fetching your order details. Please try again later.`;
    }
  }

  async handleProductSearch(input) {
    try {
      // Find category or search term
      let category = null;
      if (input.includes('premium')) category = 'Premium';
      if (input.includes('cabin'))   category = 'Cabin';
      if (input.includes('check'))   category = 'Check-in';

      let sql = 'SELECT name, price, badge, category FROM products ';
      let params = [];
      
      if (category) {
        sql += 'WHERE category = $1 ';
        params.push(category);
      }
      
      sql += 'ORDER BY is_premium DESC, price DESC LIMIT 3';

      const products = await query(sql, params);

      if (products.length === 0) {
        return `👜 We currently have no items matching your request. Try searching for "Premium bags" or "Cabin luggage".`;
      }

      let response = `✨ *Top Recommendations for you*:\n\n`;
      products.forEach((p, i) => {
        response += `${i + 1}. *${p.name}*\n   Category: ${p.category}\n   Price: ₹${p.price}\n   ${p.badge ? `Badge: ${p.badge}\n` : ''}\n`;
      });
      
      response += `\nYou can view more details on our website: http://prioritybags.com/shop`;
      return response;
    } catch (err) {
      console.error('Bot Product Search Error:', err);
      return `⚠️ I couldn't fetch our catalog right now. Please check back in a few minutes.`;
    }
  }
}

module.exports = new WhatsAppService();

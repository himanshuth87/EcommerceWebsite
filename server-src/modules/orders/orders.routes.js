const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { query } = require('../../config/db');
const { auth, adminOnly } = require('../../middleware/auth');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// @route   POST /api/v1/orders/create
// @desc    Initiate an order (create Razorpay order)
router.post('/create', auth, async (req, res) => {
    try {
        const { amount, phone, name } = req.body;
        if (!amount) return res.status(400).json({ error: 'Amount is required' });

        // Step 1: Create Order in Razorpay
        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`
        };

        const rzpOrder = await razorpay.orders.create(options);

        // Step 2: Store minimal order info in local DB (status: created)
        await query(
            'INSERT INTO orders (order_id, amount, customer_name, email, phone, status) VALUES (?, ?, ?, ?, ?, ?)',
            [rzpOrder.id, amount, name || req.user.name, req.user.email, phone || null, 'created']
        );

        res.json({ success: true, order: rzpOrder });
    } catch (err) {
        console.error('Order Error:', err);
        res.status(500).json({ error: 'Failed to initiate payment' });
    }
});

// @route   POST /api/v1/orders/verify
// @desc    Verify Razorpay payment signature & update order status
router.post('/verify', auth, async (req, res) => {
    try {
        const { order_id, payment_id, signature } = req.body;
        if (!order_id || !payment_id || !signature) {
            return res.status(400).json({ error: 'Missing payment details' });
        }

        // Verify HMAC SHA256 signature from Razorpay
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${order_id}|${payment_id}`)
            .digest('hex');

        if (expectedSignature !== signature) {
            return res.status(400).json({ error: 'Payment verification failed: invalid signature' });
        }

        await query('UPDATE orders SET status = ?, payment_id = ? WHERE order_id = ?', ['paid', payment_id, order_id]);

        res.json({ success: true, message: 'Payment successfully verified!' });
    } catch (err) {
        console.error('Verify Error:', err);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// @route   GET /api/v1/orders
// @desc    Get all orders (Admin only)
router.get('/', auth, adminOnly, async (req, res) => {
    try {
        const orders = await query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// @route   DELETE /api/v1/catalog/products/:id (handled in catalog)

module.exports = router;

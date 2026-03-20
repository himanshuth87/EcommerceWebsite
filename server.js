require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const { body, validationResult } = require('express-validator');

const { query } = require('./config/db');
const errorHandler = require('./middleware/error-handler');
const { auth, adminOnly } = require('./middleware/auth');

const catalogRoutes = require('./server-src/modules/catalog/catalog.routes');
const authV1Routes  = require('./server-src/modules/auth/auth.routes');
const orderV1Routes = require('./server-src/modules/orders/orders.routes');

const app = express();

// ── Security ──────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 100,
  standardHeaders: true, legacyHeaders: false,
  message: 'Too many requests, please try again after 15 minutes.'
});
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Static assets (public folder for images etc.) ─────
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// ── API routes ─────────────────────────────────────────
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/user',    authV1Routes);
app.use('/api/v1/orders',  orderV1Routes);

// ── Razorpay ───────────────────────────────────────────
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID    || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret'
});

// ── Legacy / utility routes ────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'UP', db: 'Supabase PostgreSQL', env: process.env.NODE_ENV, ts: new Date() })
);

app.get('/tables/products',  (_req, res) => res.sendFile(path.join(__dirname, 'tables','products','index.json')));
app.get('/tables/blog_posts',(_req, res) => res.sendFile(path.join(__dirname, 'tables','blog_posts','index.json')));

// ── Auth ───────────────────────────────────────────────
app.post('/api/register', [
  body('name').notEmpty().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, email, password } = req.body;
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.length) return res.status(400).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)', [name, email, hash]);
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) { next(err); }
});

app.post('/api/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const users = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = users[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'priority_fallback_secret',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

// ── Orders ─────────────────────────────────────────────
app.post('/api/create-order', [
  body('amount').isNumeric(),
  body('customerName').notEmpty(),
  body('email').isEmail()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { amount, customerName, email, phone } = req.body;
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });
    await query(
      'INSERT INTO orders (order_id, amount, customer_name, email, phone, status) VALUES ($1,$2,$3,$4,$5,$6)',
      [order.id, amount, customerName, email, phone || null, 'created']
    );
    res.json({ id: order.id, currency: order.currency, amount: order.amount });
  } catch (err) { next(err); }
});

app.get('/api/orders', auth, adminOnly, async (_req, res, next) => {
  try {
    const orders = await query('SELECT * FROM orders ORDER BY created_at DESC', []);
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) { next(err); }
});

// ── Serve React build ──────────────────────────────────
const DIST = path.join(__dirname, 'dist');
app.use(express.static(DIST));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/tables/') && req.path !== '/health') {
    res.sendFile(path.join(DIST, 'index.html'));
  }
});

// ── Error handler ──────────────────────────────────────
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`\n🚀 Priority Bags  |  http://localhost:${PORT}  |  ${process.env.NODE_ENV || 'development'}\n`)
);

process.on('unhandledRejection', err => console.error('Unhandled rejection:', err.message));

module.exports = app;

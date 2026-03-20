const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// MIDDLEWARE
app.use(helmet({ contentSecurityPolicy: false })); // Allow external assets
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// STATIC FRONTEND (Serving the current site files)
app.use(express.static('Public'));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/', express.static('./')); // Root files like index.html

const catalogRoutes = require('./modules/catalog/catalog.routes');
const authRoutes = require('./modules/auth/auth.routes');
const orderRoutes = require('./modules/orders/orders.routes');

app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/user', authRoutes);
app.use('/api/v1/orders', orderRoutes);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK', brand: 'TRAWORLD' }));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    ========================================
    🚀 TRAWORLD - SaaS PLATFORM v1.0
    📡 Environment: ${process.env.NODE_ENV || 'development'}
    🌐 Entrypoint: http://localhost:${PORT}
    ========================================
    `);
});

module.exports = app;

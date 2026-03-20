const express = require('express');
const router = express.Router();
const { query } = require('../../config/db');
const { auth, adminOnly } = require('../../middleware/auth');

// @route   GET /api/v1/catalog/products
// @desc    Get all products with optional filtering
router.get('/products', async (req, res) => {
    try {
        const { category, isPremium, minPrice, maxPrice, search } = req.query;
        let sql = 'SELECT * FROM products WHERE 1=1';
        const params = [];

        if (category) { sql += ' AND category = ?'; params.push(category); }
        if (isPremium !== undefined) { sql += ' AND is_premium = ?'; params.push(isPremium === 'true'); }
        if (minPrice) { sql += ' AND price >= ?'; params.push(Number(minPrice)); }
        if (maxPrice) { sql += ' AND price <= ?'; params.push(Number(maxPrice)); }
        if (search) { sql += ' AND (name ILIKE ? OR description ILIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

        const products = await query(sql, params);
        res.json({ success: true, data: products });
    } catch (err) {
        console.error('Catalog Error:', err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   GET /api/v1/catalog/products/:id
// @desc    Get single product details
router.get('/products/:id', async (req, res) => {
    try {
        const products = await query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.json({ success: true, data: products[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @route   POST /api/v1/catalog/products
// @desc    Add a new product (Admin Only)
router.post('/products', auth, adminOnly, async (req, res) => {
    try {
        const {
            name, category, price, original_price, colors, sizes,
            features, image_url, badge, is_premium, stock,
            description, weight, material, lock_type, featured, product_code
        } = req.body;

        const results = await query(
            `INSERT INTO products (name, category, price, original_price, colors, sizes, features, image_url, badge, is_premium, stock, description, weight, material, lock_type, featured, product_code)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
            [
                name, category, price, original_price || null,
                JSON.stringify(colors || []), JSON.stringify(sizes || []), JSON.stringify(features || []),
                image_url, badge, is_premium ? true : false, stock || 0,
                description, weight, material, lock_type, featured ? true : false, product_code || null
            ]
        );

        res.status(201).json({ success: true, message: 'Product added successfully!', id: results[0].id });
    } catch (err) {
        console.error('Add Product Error:', err);
        res.status(500).json({ success: false, error: 'Database error adding product.' });
    }
});

// @route   DELETE /api/v1/catalog/products/:id
// @desc    Delete a product (Admin Only)
router.delete('/products/:id', auth, adminOnly, async (req, res) => {
    try {
        await query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Product deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;

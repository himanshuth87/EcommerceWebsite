const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).json({ error: 'Authorization header required.' });

        const token = authHeader.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Token missing.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'priority_luggage_fallback_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token is invalid or expired.' });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
};

module.exports = { auth, adminOnly };

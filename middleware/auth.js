const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Please authenticate.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'priority_luggage_fallback_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Session expired or invalid.' });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
    }
    next();
};

module.exports = { auth, adminOnly };

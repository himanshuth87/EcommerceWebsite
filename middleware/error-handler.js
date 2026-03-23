const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${new Date().toISOString()}:`, err.stack || err.message);

    const statusCode = err.statusCode || 500;
    const message = (process.env.NODE_ENV === 'production' && !err.isPublic) 
        ? 'Something went wrong on our end.' 
        : err.message;

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;

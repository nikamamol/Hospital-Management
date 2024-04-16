class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Only because we are extending a built in class
        // Error.captureStackTrace(this, this.constructor);
    }
}

export const erorMiddlewere = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    if (err.code === 11000) {
        const message = `Dublicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, Try again`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }
    const errorMessage = err.errors ? Object.values(err.errors).map(item => item.message).join(" ") : err.message;
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;
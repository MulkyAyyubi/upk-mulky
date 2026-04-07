export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const bodyStatus = statusCode <= 500 ? "fail" : "error";

    res.status(statusCode).json({
        status: bodyStatus,
        message: err.message || "Internal Server Error",
    });
};
export const sendSuccessResponse = (res, data, message = 'Request successful', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}
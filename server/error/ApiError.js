class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
    static badRequest(message) {
        return new ApiError(404, message, 'Not Found');
    }
    static internalError(message) {
        return new ApiError(500, message, 'Server Error');
    }
    static forbidden(message) {
        return new ApiError(403, message, 'Access Forbidden');
    }
}

export default ApiError;
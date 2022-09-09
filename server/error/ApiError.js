class ApiError  extends Error{
    constructor(message, status) {
        super()
        this.message = message;
        this.status = status;
    }

    static badRequest(message) {
        return new ApiError(message, 400);
    }

    static forbidden(message) {
        return new ApiError(message, 403)
    }

    static internalError(message) {
        return new ApiError(message, 500)
    }
}

module.exports = ApiError;
"use strict";

function sendError(res, status, message, result = 'Error') {
    return res.status(status).json({ result, message });
}

function sendForbidden(res, message = 'You are not authorized.') {
    return sendError(res, 403, message);
}

function sendBadRequest(res, message) {
    return sendError(res, 400, message);
}

function sendNotFound(res, message) {
    return sendError(res, 404, message, 'NotOK');
}

function sendServerError(res, message = 'Internal server error') {
    return sendError(res, 500, message);
}

function handleDbError(res, err) {
    console.error(err);
    return sendServerError(res, err?.sqlMessage || err?.message || 'Database error');
}

function parsePagination(query, defaults = { page: 0, pageSize: 10 }) {
    const page = Number.isInteger(Number(query.page)) && Number(query.page) >= 0
        ? Number(query.page)
        : defaults.page;

    const pageSize = Number.isInteger(Number(query.pageSize)) && Number(query.pageSize) > 0
        ? Number(query.pageSize)
        : defaults.pageSize;

    return {
        page,
        pageSize,
        offset: page * pageSize,
    };
}

module.exports = {
    sendError,
    sendForbidden,
    sendBadRequest,
    sendNotFound,
    sendServerError,
    handleDbError,
    parsePagination,
};

import { HTTP_STATUS_CODE } from '../../types';
// TODO: [REFACTOR] automate each code group creation
const GROUPED_HTTP_STATUS_CODES = Object.freeze({
    SUCCESSFUL: {
        200: 200,
        201: 201,
        204: 204,
    },
    CLIENT_ERROR: {
        400: 400,
        401: 401,
        403: 403,
        404: 404,
        409: 409,
    },
    SERVER_ERROR: {
        500: 500,
        503: 503,
        511: 511,
    },
});
// TODO: [REFACTOR] automate each code creation
const mappedHTTPStatusCode = Object.freeze({
    200: 'SUCCESSFUL',
    201: 'SUCCESSFUL',
    204: 'SUCCESSFUL',
    400: 'CLIENT_ERROR',
    401: 'CLIENT_ERROR',
    403: 'CLIENT_ERROR',
    404: 'CLIENT_ERROR',
    409: 'CLIENT_ERROR',
    500: 'SERVER_ERROR',
    503: 'SERVER_ERROR',
    511: 'SERVER_ERROR',
});
function wrapRes(res, status, data) {
    if (data === undefined) {
        if (status === HTTP_STATUS_CODE.NOT_FOUND) {
            return res.status(status);
        }
        return res.sendStatus(status);
    }
    return res.status(status).json(data);
}
export { wrapRes };

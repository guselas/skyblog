/*
100 Continue
101 Switching Protocols
102 Processing (WebDAV)
2xx Success
 200 OK
 201 Created
202 Accepted
203 Non-Authoritative Information
 204 No Content
205 Reset Content
206 Partial Content
207 Multi-Status (WebDAV)
208 Already Reported (WebDAV)
226 IM Used
3xx Redirection
300 Multiple Choices
301 Moved Permanently
302 Found
303 See Other
 304 Not Modified
305 Use Proxy
306 (Unused)
307 Temporary Redirect
308 Permanent Redirect (experimental)
4xx Client Error
 400 Bad Request
 401 Unauthorized
402 Payment Required
 403 Forbidden
 404 Not Found
405 Method Not Allowed
406 Not Acceptable
407 Proxy Authentication Required
408 Request Timeout
 409 Conflict
410 Gone
411 Length Required
412 Precondition Failed
413 Request Entity Too Large
414 Request-URI Too Long
415 Unsupported Media Type
416 Requested Range Not Satisfiable
417 Expectation Failed
418 I'm a teapot (RFC 2324)
420 Enhance Your Calm (Twitter)
422 Unprocessable Entity (WebDAV)
423 Locked (WebDAV)
424 Failed Dependency (WebDAV)
425 Reserved for WebDAV
426 Upgrade Required
428 Precondition Required
429 Too Many Requests
431 Request Header Fields Too Large
444 No Response (Nginx)
449 Retry With (Microsoft)
450 Blocked by Windows Parental Controls (Microsoft)
451 Unavailable For Legal Reasons
499 Client Closed Request (Nginx)
5xx Server Error
 500 Internal Server Error
501 Not Implemented
502 Bad Gateway
503 Service Unavailable
504 Gateway Timeout
505 HTTP Version Not Supported
506 Variant Also Negotiates (Experimental)
507 Insufficient Storage (WebDAV)
508 Loop Detected (WebDAV)
509 Bandwidth Limit Exceeded (Apache)
510 Not Extended
511 Network Authentication Required
598 Network read timeout error
599 Network connect timeout error
*/

class BaseAPI {

    constructor(uri, app,nameAPI) {
        this.ST_Ok = 200;
        this.ST_Created = 201;
        this.ST_Accepted = 202;
        this.ST_BadRequest = 400;
        this.ST_Forbidden = 403;
        this.ST_NotFound = 404;
        this.ST_Conflict = 409;
        this.ST_InternalServerError = 500;
        this.uri = uri;
        this.app = app;
        this.nameAPI = nameAPI;
    }


    async model(req, res) {
        this.sendData(res, new this.modelClass());
    }
    async fullModel(req, res) {
        this.sendData(res, new this.fullModelClass());
    }

    async seed(req, res) {
        console.log(`${this.nameAPI}API: seed(): `);
        let errors = [];
        const result = true;
        if (result) {
            this.sendData(res, result);
        }
        else {
            this.sendError(res, this.ST_InternalServerError, `${this.nameAPI}API.seed()`, errors);
        }
    }
    async unseed(req, res) {
        console.log(`${this.nameAPI}API: unseed(): `);
        let errors = [];
        let deleted = [];
        const result = true;
        if (result) {
            this.sendData(res, deleted)
        }
        else {
            this.sendError(res, this.ST_InternalServerError, `${this.nameAPI}API.unseed()`, errors);
        }
    }

    loadDTOFromBodyProperty(recordDTO, body, property) {
        if (property in body && property in recordDTO) {
            recordDTO[property] = body[property];
        }
    }

    loadDTOFromBody(recordDTO, body) {
        for (let prop in recordDTO) {
            this.loadDTOFromBodyProperty(recordDTO, body, prop);
        }
    }

    sendData(res, data) {
        res.status(this.ST_Ok).send(data);
    }

    sendError(res, statusCode, error, messages) {
        if (Array.isArray(messages)) {
            messages = messages.join(`\r\n`);
        }
        console.log(`${this.nameAPI}API.${error}: error(${statusCode}) message: ${messages}`);
        res.status(statusCode).send(new ErrorEventAPI(`${this.nameAPI}API.${error}`, messages));
    }
}

class ErrorEventAPI {
    constructor(errorCode, message) {
        this.error = errorCode;
        this.message = message;
    }
}

module.exports = BaseAPI, ErrorEventAPI;
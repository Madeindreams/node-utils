import { Request, Response, NextFunction } from 'express';

/**
 * Overrides the res.send and res.json methods of the response object to log the response time.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {void}
 */
function requestTimeLogger(req: Request, res: Response, next: NextFunction): void {
    const start = process.hrtime();

    // Override res.json
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
        setResponseTimeHeader(res, start);
        return originalJson(body);
    };

    next();
}

/**
 * Sets the response time header in the response object.
 *
 * @param {Response} res - The response object.
 * @param {Array<number>} start - The start time of the request represented as [seconds, nanoseconds].
 * @return {void}
 */
function setResponseTimeHeader(res: Response, start: [number, number]): void {
    const durationInMilliseconds = getDurationInMilliseconds(start);
    console.log(`${res.req.method} ${res.req.originalUrl} [${durationInMilliseconds.toLocaleString()} ms]`);
    res.setHeader('X-Response-Time', `${durationInMilliseconds} ms`);
}

/**
 * Calculates the duration in milliseconds since the given start time.
 *
 * @param {Array<number>} start - The start time represented as an array of [seconds, nanoseconds].
 * @return {number} The duration in milliseconds.
 */
function getDurationInMilliseconds(start: [number, number]): number {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

export default requestTimeLogger;

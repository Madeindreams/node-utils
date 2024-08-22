import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

// Extend the SyntaxError to include status and body properties
interface JsonSyntaxError extends SyntaxError {
    status?: number;
    body?: any;
}

/**
 * Handles JSON errors and sends an appropriate response.
 *
 * @param {JsonSyntaxError} err - The error object to handle.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @return {void | Response} - Returns a response or void.
 */
function jsonErrorHandler(err: JsonSyntaxError, req: Request, res: Response, next: NextFunction): void | Response {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid JSON payload, the structure of the JSON body is incorrect' });
    }
    next();
}

export default jsonErrorHandler;

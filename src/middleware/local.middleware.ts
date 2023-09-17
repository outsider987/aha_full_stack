import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import constants from '../config/constants';
import {getLocaleKey} from '../utils/local';

@Injectable()
/**
 * Middleware for setting the locale.
 * @implements {NestMiddleware}
 */
export class LocaleMiddleware implements NestMiddleware {
  /**
     * Sets the locale.
     * @param {Request} request - The request object.
     * @param {Response} response - The response object.
     * @param {NextFunction} next - The next function.
     * @return {void}
     */
  use(request: Request, response: Response, next: NextFunction) {
    global.locale = request.header('locale') ?? constants.default.locale;
    global.localeKey = getLocaleKey(global.locale);
    next();
  }
}

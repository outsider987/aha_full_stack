import {HttpException, HttpStatus} from '@nestjs/common';
import {failureResponse} from '../utils/response';
import errorCodesExternal from '../config/errorCodesExternal';

import * as logger from '../utils/logger';

/**
 * Application Error Exception.
 */
export class ApplicationErrorException extends HttpException {
  /**
   * Application Error Exception constructor.
   * @param {string} errorCode - The error code.
   * @param {string} remarks - The remarks.
   * @param {HttpStatus} httpStatusCode - The HTTP status code. Defaults to 400.
   * @return {void}
   */
  constructor(
      errorCode:keyof typeof errorCodesExternal,
      remarks?,
      httpStatusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    const errorMessage: string =
    errorCodesExternal[errorCode][global.localeKey];

    logger.event({
      errorCode,
      remarks,
    });

    super(failureResponse(errorMessage, errorCode), httpStatusCode);
  }
}

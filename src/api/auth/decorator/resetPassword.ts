import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import errorCodesExternal from 'src/config/errorCodesExternal';

import { SucessDeCorator } from 'src/utils/decorator';

/**
 * Swagger decorator for the register endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function ResetPasswordDecotator() {
  return applyDecorators(
    ApiOperation({
      summary: 'send email to user to reset password',
      description: 'it will send email to user to reset password'
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Will send email to user to reset password',
      type: SucessDeCorator
    }),
    ApiResponse({
      status: 4002,
      description: errorCodesExternal[4002].En
    })
  );
}

/**
 * Swagger decorator for the reset endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function ResetPasswordTokenDecotator() {
  return applyDecorators(
    ApiOperation({
      summary: 'user get mail token then make request to reset password',
      description: 'use from mail token to reset password'
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'reset password successfully',
      type: SucessDeCorator
    }),
    ApiResponse({
      status: 4005,
      description: errorCodesExternal[4005].En
    }),
    ApiResponse({
      status: 4007,
      description: errorCodesExternal[4007].En
    })
  );
}

import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import errorCodesExternal from 'src/config/errorCodesExternal';
import { SucessDeCorator } from 'src/utils/decorator';

/**
 * Swagger decorator for the register endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function EmailVerifyDecotator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Email verify endpoint ',
      description:
        'it will send registeration email to user , and it will redirect to login page'
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User created successfully',
      type: SucessDeCorator
    }),
    ApiResponse({
      status: 4006,
      description: errorCodesExternal[4006].En
    })
  );
}

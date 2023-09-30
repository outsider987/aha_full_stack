import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import errorCodesExternal from 'src/config/errorCodesExternal';
import { TokensResponse } from 'src/utils/decorator';

/**
 * Swagger decorator for the google call back endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function GoogleCallBackDecotator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Google callback endpoint for creating a new user',
      description: "it doesn't need confimed email"
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User created successfully',
      type: TokensResponse
    }),
    ApiResponse({
      status: 4004,
      description: errorCodesExternal[4004].En
    })
  );
}

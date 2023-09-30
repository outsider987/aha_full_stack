import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokensResponse } from 'src/utils/decorator';

/**
 * Swagger decorator for the register endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function RefreshDecotator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh endpoint for creating a new user',
      description: 'need to send refresh token'
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'refresh token created successfully',
      type: TokensResponse
    })
  );
}

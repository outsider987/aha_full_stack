import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokensResponse } from 'src/utils/decorator';

/**
 * Swagger decorator for the change name endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function ChangeNameDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Change name endpoint ',
      description: 'will return tokens'
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'change name successfully',
      type: TokensResponse
    }),
    ApiResponse({
      status: 4007,
      description: 'change name failed'
    })
  );
}

import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Swagger decorator for the change name endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function ChangeNameDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Change name endpoint for creating a new user',
      description: "it doesn't need confimed email"
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'change name successfully'
    }),
    ApiResponse({
      status: 4007,
      description: 'change name failed'
    })
  );
}

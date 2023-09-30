import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Swagger decorator for the dashboard endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function StatisticsDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Statistics endpoint for creating a new user',
      description: "it doesn't need confimed email"
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Statistics successfully'
    })
  );
}

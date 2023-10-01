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
      summary: 'Statistics endpoint get user data',
      description: "list of user's statistics"
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Statistics successfully'
    })
  );
}

import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Swagger decorator for the dashboard endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function DashboardDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Dashboard endpoint get user data',
      description: "list of user's dashboard"
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Dashboard successfully'
    })
  );
}

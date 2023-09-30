import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../dtos';
import errorCodesExternal from 'src/config/errorCodesExternal';
import { TokensResponse } from 'src/utils/decorator';

/**
 * Swagger decorator for the login endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function LoginDecotator() {
  return applyDecorators(
    ApiOperation({ summary: 'Login endpoint for generating a JWT token' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'JWT token generated successfully',
      type: TokensResponse
    }),
    ApiResponse({
      status: 4003,
      description: errorCodesExternal[4003].En
    }),
    ApiResponse({
      status: 4008,
      description: errorCodesExternal[4008].En
    }),
    ApiResponse({
      status: 4006,
      description: errorCodesExternal[4006].En
    }),
    ApiResponse({
      status: 4100,
      description: errorCodesExternal[4100].En
    }),

    ApiBody({
      type: LoginDto,
      description: 'Login DTO'
    })
  );
}

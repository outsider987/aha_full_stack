import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import errorCodesExternal from 'src/config/errorCodesExternal';
import { RegisterDto } from '../dtos/register.dto';
import { SucessDeCorator } from 'src/utils/decorator';

/**
 * Swagger decorator for the register endpoint
 * @return {MethodDecorator}
 * @constructor
 */
export function RegisterDecotator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Register endpoint for creating a new user',
      description: 'it will send registeration email to user'
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User created successfully',
      type: SucessDeCorator
    }),
    ApiResponse({
      status: 4004,
      description: errorCodesExternal[4004].En
    }),
    ApiResponse({
      status: 4005,
      description: errorCodesExternal[4005].En
    }),
    ApiBody({
      type: RegisterDto,
      description: 'Register DTO'
    })
  );
}

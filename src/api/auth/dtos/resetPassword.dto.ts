import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Reset Password Dto
 * @param {string} password
 * @param {string} confirmPassword
 */
export class ResetPasswordDto {
  @ApiProperty({
    example: '',
    description: 'Old password'
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;
  @ApiProperty({
    example: '',
    description: 'Password'
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: '',
    description: 'Confirm Password'
  })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

/**
 * Reset Password Mail Dto
 * @param {string} password
 * @param {string} confirmPassword
 */
export class ResetPasswordMailDto {
  @ApiProperty({
    example: '',
    description: 'Email'
  })
  @IsNotEmpty()
  @IsString()
  email;
}

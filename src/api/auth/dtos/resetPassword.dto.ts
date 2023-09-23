import {IsNotEmpty, IsString} from 'class-validator';

/**
 * Reset Password Dto
 * @param {string} password
 * @param {string} confirmPassword
 */
export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
    password: string;

  @IsNotEmpty()
  @IsString()
    confirmPassword: string;
}

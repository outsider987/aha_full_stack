import {IsEmail, IsNotEmpty, IsString} from 'class-validator';

/**
 * Login DTO class.
 * @class
 * @implements {LoginDto}
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
      email: string;

    @IsString()
    @IsNotEmpty()
      password: string;
}

import {IsEmail, IsNotEmpty, IsString, Length, Matches,
} from 'class-validator';

/**
 * RegisterDto
 * @export
 * @class
 * @implements {RegisterDto}
 * @param {string} userName - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} twicePassword - The user's password again.
 */
export class RegisterDto {
    @IsString()
      userName: string;

    @IsEmail()
      email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 100) // Ensure the password has at least 8 characters
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!-]).{8,}$/
        , {
          message:
        `Password is too weak. It must contain at least one lowercase letter, 
        one uppercase letter, one digit, and one special character.`,
        })
      password: string;

    @IsString()
    @Length(8, 20)
      confirmPassword: string;
}

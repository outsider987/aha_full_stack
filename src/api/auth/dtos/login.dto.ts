import {IsEmail, IsNotEmpty, IsString, Length, Matches} from 'class-validator';

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
    @Length(8, 100) // Ensure the password has at least 8 characters
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])\[A-Za-z\d@$!%*?&]+$/
        , {
          message: `Password is too weak. It must contain at least one 
          lowercase letter, 
          one uppercase letter, one digit, and one special character.`,
        })
      password: string;
}

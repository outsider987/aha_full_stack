import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Login DTO class.
 * @class
 * @implements {LoginDto}
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 */
export class LoginDto {
  @ApiProperty({
    example: 'john_doe@example.com',
    description: 'Username'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password'
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!-]).{8,}$/, {
    message: `Password is too weak. It must contain at least one lowercase letter, 
          one uppercase letter, one digit, and one special character.`
  })
  password: string;
}

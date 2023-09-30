import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * ChangeName DTO class.
 * @param {string} userName - The user's name.
 */
export class ChangeNameDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username'
  })
  @IsString()
  @IsNotEmpty()
  userName: string;
}

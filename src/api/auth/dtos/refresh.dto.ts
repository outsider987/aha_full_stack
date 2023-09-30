import { ApiProperty } from '@nestjs/swagger';

/**
 * Refresh token DTO.
 * @class
 * @implements {RefreshTokenDto}
 * @param {string} refreshToken - The refresh token.
 */
export class RefreshTokenDto {
  @ApiProperty({
    example: '',
    description: 'refreshtoken'
  })
  refreshToken: string;
}

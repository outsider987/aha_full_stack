import { ApiProperty } from '@nestjs/swagger';

/**
 * Swagger decorator for the base
 */
export class SucessDeCorator {
  @ApiProperty()
  sucess: boolean;
  @ApiProperty()
  requestId: number;
}

/**
 * Swagger decorator for the base
 */
export class FailedDeCorator {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  requestId: number;
  @ApiProperty()
  error: any;

  @ApiProperty()
  remarks: any;
}

/**
 * tokens data
 */
class TokensData {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}

/**
 * tokens response
 */
export class TokensResponse extends SucessDeCorator {
  @ApiProperty({
    type: TokensData
  })
  data;
}

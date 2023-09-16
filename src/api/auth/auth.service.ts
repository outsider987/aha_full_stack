import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';


@Injectable()
/**
 * Service for handling authentication-related functionality.
 */
export class AuthService {
  /**
   * Creates an instance of AuthService.
   * @param {JwtService} jwtService - The JWT service instance.
   */
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a JWT token based on the user's ID.
   * @param {string} userId - The ID of the user to generate the token for.
   * @return {Promise<string>} - The generated JWT token.
   */
  async generateJwtToken(userId: string): Promise<string> {
    const payload = {sub: userId};
    return this.jwtService.signAsync(payload);
  }

  /**
   * Validates a JWT token.
   * @param {string} token - The JWT token to validate.
   * @return {Promise<any>} - The decoded token payload.
   * @throws {Error} - If the token is invalid.
   */
  async validateJwtToken(token: string): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

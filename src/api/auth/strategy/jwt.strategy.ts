import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {AuthService} from '../auth.service';


@Injectable()
/**
 * Strategy for authenticating users with JSON Web Tokens (JWTs).
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   * @param {AuthService} authService
   * - The AuthService instance for user validation.
   */
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * Validates the user based on the payload extracted from the JWT token.
   * @param {any} payload - The payload extracted from the JWT token.
   * @return {Promise<any>} - An object containing user information.
   */
  async validate(payload: any): Promise<any> {
    return {userId: payload.sub, username: payload.username};
  }
}

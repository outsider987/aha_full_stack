import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy, ExtractJwt} from 'passport-jwt';
import {AuthService} from '../auth.service';
import {ConfigService} from '@nestjs/config';


@Injectable()
/**
 * Strategy for authenticating users with JSON Web Tokens (JWTs).
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Creates an instance of JwtStrategy.
   * @param {AuthService} authService - The injected AuthService instance.
   * @param {ConfigService} config - The injected ConfigService instance.
   * - The AuthService instance for user validation.
   */
  constructor(private readonly authService: AuthService,
    private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwt').secret,
    });
  }

  /**
   * Validates the user based on the payload extracted from the JWT token.
   * @param {any} payload - The payload extracted from the JWT token.
   * @return {Promise<any>} - An object containing user information.
   */
  async validate(payload: any): Promise<any> {
    return {userId: payload.userId, email: payload.email};
  }
}

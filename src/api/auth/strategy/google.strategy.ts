import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service'; // Create this service

@Injectable()
/**
 * Google OAuth2 strategy for Passport.
 */
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  /**
   * GoogleStrategy constructor.
   * @param {AuthService} authService - The injected AuthService instance.
   * @return {void}
   * @throws {Error} - If the environment variables are not set.
   */ 
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    });
  }

  /**
   * Validates the user based on the profile extracted from the JWT token.
   * @param {string} accessToken - The access token extracted from the JWT token.
   * @param {string} refreshToken - The refresh token extracted from the JWT token.
   * @param {any} profile - The profile extracted from the JWT token.
   * @return {Promise<any>} - An object containing user information.
   * @throws {Error} - If the user already exists.
   */
  async validate(accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.findOrCreateGoogleUser(profile);
    return user;
  }
}

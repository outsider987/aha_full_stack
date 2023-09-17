import {Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthGuard} from '@nestjs/passport';
import {LoginDto} from './dtos/login.dto';
import {successResponse} from 'src/utils/response';
import {RefreshTokenDto} from './dtos/refresh.dto';
import {RegisterDto} from './dtos/register.dto';
import cookie from 'cookie';
import {ConfigService} from '@nestjs/config';


@Controller('auth')
/**
 * Controller for handling authentication related requests.
 */
export class AuthController {
  /**
     * AuthController constructor.
     * @param {AuthService} authService - The injected AuthService instance.
     * @param {ConfigService} config - The injected ConfigService instance.
     */
  constructor(
      private readonly authService: AuthService,
      private readonly config: ConfigService
  ) {}

    /**
     * Login endpoint for generating a JWT token.
     * @param {LoginDto} dto - The login DTO.
     * @return {Promise<{ accessToken: string }>} - The generated JWT token.
     */
    @Post('login')
  async login(@Body() dto: LoginDto) {
    const {accessToken, refreshToken} = await this.authService.login(
        dto, 'local'
    );
    return successResponse({data: {accessToken, refreshToken}});
  }

    /**
     * Register endpoint for generating a JWT token.
     * @param {RegisterDto} dto - The register DTO.
     * @return {Promise<{ token: string }>} - The generated JWT token.
     * @throws {Error} - If the user already exists.
     * @throws {Error} - If the passwords do not match.
     */
    @Post('register')
    async register(@Body() dto:RegisterDto) {
      if (dto.password !== dto.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const token = await this.authService.register(dto);
      return {token};
    }

    /**
     * Login endpoint for google authentication.
     */
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {}

    /**
     * Login endpoint for google authentication call back.
     * @param {any} req - The request object.
      * @param {any} res - The response object.
     * @return {Promise<{ token: string }>} - The generated JWT token.
     * @throws {Error} - If the user already exists.
     */
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(
      @Req() req,
      @Res({passthrough: true}) res
    ) {
      const token = await this.authService.login(req.user, 'google');
      const cookies = cookie.serialize('jwtToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60,
        path: '/',
      });

      const backEndPoint=this.config.get('backEndPoint');
      const redirectUrl = `${backEndPoint}/login?token=${token}`;
      res.setHeader('Set-Cookie', cookies);
      res.redirect(302, redirectUrl);
    }

    /**
     * Refresh endpoint for generating a JWT token.
     * @param {RefreshTokenDto} dto - The refresh token DTO.
     * @return {Promise<{ token: string }>} - The generated JWT token.
     */
    @Post('refresh')
    async refresh(@Body() dto:RefreshTokenDto) {
      const {accessToken} = await this.authService.refresh(dto);
      return successResponse({data: accessToken});
    }
}

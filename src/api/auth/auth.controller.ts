import {
  Body, Controller, Get,
  HttpStatus, Param, Post, Req,
  Res, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthGuard} from '@nestjs/passport';
import {LoginDto} from './dtos/login.dto';
import {successResponse} from 'src/utils/response';
import {RefreshTokenDto} from './dtos/refresh.dto';
import {RegisterDto} from './dtos/register.dto';
import {ConfigService} from '@nestjs/config';
import {
  ApplicationErrorException,
} from 'src/exceptions/application-error.exception';
import {localLog} from 'src/utils/logger';
import {EmailService} from '../email/email.service';


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
      private readonly authService:AuthService,
      private readonly config:ConfigService,
      private readonly emailService:EmailService
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
        throw new ApplicationErrorException(
            'E_0005', null, HttpStatus.UNAUTHORIZED);
      }
      await this.authService.register(dto);

      this.emailService.sendVerificationEmail(dto.email);
    }

    /**
     * Login endpoint for google authentication.
     */
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {
      localLog('googleLogin sucess');
    }

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
      localLog('start to googleLoginCallback');
      const token = await this.authService.login(req.user, 'google');
      res.cookie('jwtAccessToken', token.accessToken, );
      res.cookie('jwtRefreshToken', token.refreshToken, );

      const frontEndPoint=this.config.get('frontEndPoint');
      const redirectUrl = `${frontEndPoint}`;
      console.log(' googleLoginCallback redirectUrl', redirectUrl);
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

    /**
     * @param {string} token - The verification token.
     * @return {Promise<{ message: string }>} - The success message.
     * @throws {Error} - If the token is invalid.
     */
    @Get('verify-email/:token')
    async verifyEmail(@Param('token') token: string) {
      if (!await this.emailService.findByVerificationToken(token)) {
        throw new ApplicationErrorException(
            'E_0006', null, HttpStatus.UNAUTHORIZED);
      }

      return successResponse({message: 'Email verification successful'});
    }
}

import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dtos/login.dto';
import { successResponse } from 'src/utils/response';
import { RefreshTokenDto } from './dtos/refresh.dto';
import { RegisterDto } from './dtos/register.dto';
import { ConfigService } from '@nestjs/config';
import { ApplicationErrorException } from 'src/exceptions/application-error.exception';
import { localLog } from 'src/utils/logger';
import { EmailService } from '../email/email.service';
import { Response } from 'express';
import {
  ResetPasswordDto,
  ResetPasswordMailDto
} from './dtos/resetPassword.dto';
import { JwtPayload } from './interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GoogleCallBackDecotator,
  RegisterDecotator,
  LoginDecotator,
  EmailVerifyDecotator,
  ResetPasswordDecotator,
  ResetPasswordTokenDecotator
} from './decorator';

@Controller('auth')
@ApiTags('Auth')
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
    private readonly config: ConfigService,
    private readonly emailService: EmailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * Login endpoint for generating a JWT token.
   * @param {LoginDto} dto - The login DTO.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @return {Promise<{ accessToken: string }>} - The generated JWT token.
   * @throws {Error} - If the user does not exist.
   */
  @Post('login')
  @LoginDecotator()
  async login(
    @Body() dto: LoginDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken, refreshToken } = await this.authService.login(
      dto,
      'local'
    );

    await res.cookie('accessToken', accessToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true
    });
    res.cookie('refreshToken', refreshToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true
    });
    return successResponse({ data: { accessToken, refreshToken } });
  }

  /**
   * Register endpoint for generating a JWT token.
   * @param {RegisterDto} dto - The register DTO.
   * @return {Promise<{ token: string }>} - The generated JWT token.
   * @throws {Error} - If the user already exists.
   * @throws {Error} - If the passwords do not match.
   */
  @Post('register')
  @RegisterDecotator()
  async register(@Body() dto: RegisterDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new ApplicationErrorException(
        '4005',
        null,
        HttpStatus.UNAUTHORIZED
      );
    }
    await this.authService.register(dto);

    return await this.emailService.sendVerificationEmail(dto.email);
  }

  /**
   * Login endpoint for google authentication.
   */
  @UseGuards(AuthGuard('google'))
  @Get('google')
  @ApiOperation({
    summary: 'Login endpoint for google authentication call back',
    description: 'Login endpoint for google authentication call back'
  })
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
  @GoogleCallBackDecotator()
  async googleLoginCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {
    localLog('start to googleLoginCallback');
    const token = await this.authService.login(req.user, 'google');

    res.cookie('accessToken', token.accessToken, {
      secure: true,
      sameSite: 'none',
      httpOnly: true
    });
    res.cookie('refreshToken', token.refreshToken);

    const frontEndPoint = this.config.get('frontEndPoint');
    const redirectUrl = `${frontEndPoint}`;
    console.log(' googleLoginCallback redirectUrl', redirectUrl);
    await res.redirect(302, redirectUrl);
  }

  /**
   * Logout endpoint for google authentication.
   * @param {RefreshTokenDto} dto - The request object.
   */
  @Post('refresh')
  @GoogleCallBackDecotator()
  async refresh(@Body() dto: RefreshTokenDto) {
    const jwtPayload = (await this.authService.validateJwtToken(
      dto.refreshToken
    )) as JwtPayload;

    const { accessToken, refreshToken } =
      await this.authService.refresh(jwtPayload);
    return successResponse({ data: { accessToken, refreshToken } });
  }

  /**
   * @param {string} token - The verification token.
   * @param {Response} res - The response object.
   * @return {Promise<{ message: string }>} - The success message.
   * @throws {Error} - If the token is invalid.
   */
  @Get('verify-email/:token')
  @EmailVerifyDecotator()
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    const frontEndPoint = this.config.get('frontEndPoint');
    const user = await this.emailService.findByVerificationToken(token);
    if (!user) {
      throw new ApplicationErrorException(
        '4006',
        null,
        HttpStatus.UNAUTHORIZED
      );
    } else {
      const { accessToken, refreshToken } =
        await this.authService.generateTokens({
          email: user.raw.email,
          confirmed: true,
          userName: user.raw.userName,
          provider: 'local'
        });
      res.cookie('accessToken', accessToken);
      res.cookie('refreshToken', refreshToken);
    }

    res.redirect(302, frontEndPoint);
    return successResponse({ message: 'Email verification successful' });
  }

  /**
   * reset password
   * @param {string}dto
   */
  @Post('reset-password')
  @ResetPasswordDecotator()
  async forgotPassword(@Body() dto: ResetPasswordMailDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email }
    });

    if (!user) {
      throw new ApplicationErrorException(
        '4002',
        null,
        HttpStatus.UNAUTHORIZED
      );
    }

    await this.emailService.sendResetPasswordEmail(dto.email);

    return successResponse({ message: 'Password reset email sent' });
  }

  /**
   * @param {ResetPasswordDto} dto - The reset password DTO.
   * @param {string} token - The reset password token.
   * @return {Promise<{ message: string }>} - The success message.
   * @throws {Error} - If the token is invalid.
   * @throws {Error} - If the passwords do not match.
   */
  @Post('reset-password/:token')
  @ResetPasswordTokenDecotator()
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Param('token') token: string
  ) {
    await this.authService.validateResetToken(token);

    if (dto.password !== dto.confirmPassword) {
      throw new ApplicationErrorException(
        '4005',
        null,
        HttpStatus.UNAUTHORIZED
      );
    }

    await this.authService.resetPassword(token, dto.password);

    return successResponse({ message: 'Password reset successful' });
  }
}

import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtPayload } from './interface';
import { ApplicationErrorException } from 'src/exceptions/application-error.exception';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { LoginInformation } from 'src/entities/loginInformation.entity';

@Injectable()
/**
 * Service for handling authentication-related functionality.
 */
export class AuthService {
  /**
   * Creates an instance of AuthService.
   * @param {JwtService} jwtService - The JWT service instance.
   * @param {Repository<User>} userRepository
   *  - The injected User repository instance.
   * @param {ConfigService} config - The injected ConfigService instance.
   * @param {EmailService} emailService - The injected EmailService instance.
   */
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LoginInformation)
    private readonly loginInformationRepository: Repository<LoginInformation>,
    private readonly config: ConfigService,
    private readonly emailService: EmailService
  ) {}

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

  /**
   * Finds or creates a user based on the Google profile data.
   * @param {any} profile - The Google profile data.
   * @return {Promise<User>} - The user that was found or created.
   * @throws {Error} - If the user already exists.
   */
  async findOrCreateGoogleUser(profile: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { googleId: profile.id, email: profile.emails[0].value }
    });

    if (!user) {
      const user = this.userRepository.create({
        userName: profile.name.familyName + profile.name.givenName,
        googleId: profile.id,
        email: profile.emails[0].value,
        provider: 'google'
      });
      user.isEmailConfirmed = true;

      const createdUser = await this.userRepository.save(user);

      const loginInformation = await this.loginInformationRepository.create({
        user: { id: createdUser.id },
        loginCount: 0
      });
      const res = await this.loginInformationRepository.save(loginInformation);
      console.log(res);
      return user;
    }
    return user;
  }

  /**
   * Logs in a user.
   * @param {LoginDto} dto - The user to login.
   * @param {string} provider - The provider of the user.
   * @return {Promise<{ access_token: string }>} - The generated JWT token.
   * @throws {Error} - If the user doesn't exist.
   * @throws {Error} - If the password is incorrect.
   */
  async login(dto: LoginDto, provider: 'google' | 'local') {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: { loginInformation: true }
    });

    if (!user) {
      throw new ApplicationErrorException(
        'E_0002',
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    } else {
      this.loginInformationRepository.update(
        {
          user: { id: user.id }
        },
        {
          loginCount: user.loginInformation.loginCount + 1
        }
      );
    }

    const payload: JwtPayload = {
      userName: user.userName,
      provider,
      confirmed: user.isEmailConfirmed,
      email: user.email
    };

    // If the user exists, generate a JWT token
    switch (provider) {
      case 'google':
        return this.generateTokens(payload);
      case 'local':
        if (!user.isEmailConfirmed) {
          throw new ApplicationErrorException(
            'E_008',
            undefined,
            HttpStatus.UNAUTHORIZED
          );
        }
        if (await !bcrypt.compareSync(dto.password, user.password)) {
          throw new ApplicationErrorException(
            'E_0001',
            undefined,
            HttpStatus.UNAUTHORIZED
          );
        }

        return this.generateTokens(payload);
      default:
        throw new ApplicationErrorException(
          'UNKNOWN',
          undefined,
          HttpStatus.BAD_REQUEST
        );
    }
  }
  /**
   * Generates a JWT token based on the user's ID.
   * @param {JwtPayload} payload - The payload to sign.
   * @return {Promise<string>} - The generated JWT token.
   */
  async generateTokens(payload: JwtPayload) {
    const secret = this.config.get('jwt.secret');
    const expiresIn = this.config.get('jwt.expiresIn');
    const refreshExpiresIn = this.config.get('jwt.refreshExpiresIn');
    const accessToken = this.jwtService.sign(payload, { expiresIn, secret });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: refreshExpiresIn,
      secret
    });

    return { accessToken, refreshToken };
  }

  /**
   * Registers a user.
   * @param {RegisterDto} dto - The user to register.
   * @return {Promise<{ access_token: string }>} - The generated JWT token.
   * @throws {Error} - If the user already exists.
   */
  async register(dto: RegisterDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ['loginInformation']
    });
    // If the user already exists, throw an error
    if (user) {
      throw new ApplicationErrorException(
        'E_0004',
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    } else {
      const password = await bcrypt.hashSync(dto.password, 15);
      const user = await this.userRepository.create({
        userName: dto.userName,
        email: dto.email,
        password: password,
        provider: 'local'
      });
      await this.userRepository.save(user);
      const payload: JwtPayload = {
        userName: dto.userName,
        provider: 'local',
        confirmed: user.isEmailConfirmed,
        email: dto.email
      };

      const loginInformation = this.loginInformationRepository.create({
        user: { id: user.id },
        loginCount: 0
      });
      await this.loginInformationRepository.save(loginInformation);

      return this.generateTokens(payload);
    }
  }

  /**
   * Refreshes a JWT token.
   * @param {JwtPayload} decoded - JwtPayload.
   * @return {Promise<{ accessToken: string, refreshToken: string }>}
   */
  async refresh(decoded: JwtPayload) {
    const payload = decoded;
    return this.generateTokens(payload);
  }

  /**
   * Sends a verification email to the specified email address.
   * @param {string}email
   */
  async sendResetPasswordEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new ApplicationErrorException(
        'E_0002',
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }
    return await this.emailService.sendResetPasswordEmail(email);
  }

  /**
   *
   * @param {string} token - The reset password token.
   * @param {string} password - The new password.
   *
   *
   */
  async validateResetToken(token: string) {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token }
    });
    if (!user) {
      throw new ApplicationErrorException(
        'E_0007',
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }
    return true;
  }

  /**
   * Resets a user's password.
   * @param {string} token - The reset password token.
   * @param {string} password - The new password.
   */
  async resetPassword(token: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token }
    });
    if (!user) {
      throw new ApplicationErrorException(
        'E_0007',
        undefined,
        HttpStatus.UNAUTHORIZED
      );
    }
    user.password = await bcrypt.hashSync(password, 15);
    await this.userRepository.save(user);
    return { message: 'Password reset successful' };
  }
}

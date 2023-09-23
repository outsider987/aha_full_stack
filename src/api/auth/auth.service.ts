import {HttpStatus, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/entities/user.entity';
import {Repository} from 'typeorm';
import {LoginDto} from './dtos/login.dto';
import {RefreshTokenDto} from './dtos/refresh.dto';
import {RefreshToken} from 'src/entities/refreshTokens.entity';
import {RegisterDto} from './dtos/register.dto';
import {JwtPayload} from './interface';
import {
  ApplicationErrorException,
} from 'src/exceptions/application-error.exception';
import * as bcrypt from 'bcrypt';
import {ConfigService} from '@nestjs/config';


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
   */
  constructor(private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly config: ConfigService
  ) {

  }

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

  /**
   * Finds or creates a user based on the Google profile data.
   * @param {any} profile - The Google profile data.
   * @return {Promise<User>} - The user that was found or created.
   * @throws {Error} - If the user already exists.
   */
  async findOrCreateGoogleUser(profile: any): Promise<User> {
    const user =await this.userRepository.findOne({where:
       {googleId: profile.id, email: profile.emails[0].value}});

    if (!user) {
      const user = this.userRepository.create({
        userName: profile.name.familyName+profile.name.givenName,
        googleId: profile.id,
        email: profile.emails[0].value,
      });

      await this.userRepository.save(user);
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
  async login(dto: LoginDto, provider:'google'|'local') {
    const user = await this.userRepository.findOne({where: {email: dto.email}});
    // If the user doesn't exist, throw an error
    if (!user) {
      throw new ApplicationErrorException(
          'E_0002',
          undefined,
          HttpStatus.UNAUTHORIZED
      );
    }
    const payload:JwtPayload = {
      userName: user.userName,
      provider,
      email: user.email,
    };

    // If the user exists, generate a JWT token
    switch (provider) {
      case 'google':
        return this.generateTokens(payload, user.id);
      case 'local':
        if (await !bcrypt.compare(user.password, dto.password)) {
          throw new ApplicationErrorException(
              'E_0003',
              undefined, HttpStatus.UNAUTHORIZED
          );
        }
        return this.generateTokens(payload, user.id);
      default:
        throw new ApplicationErrorException(
            'UNKNOWN'
            , undefined,
            HttpStatus.BAD_REQUEST
        );
    }
  }
  /**
   * Generates a JWT token based on the user's ID.
   * @param {JwtPayload} payload - The payload to sign.
   * @param {string} userId - The ID of the user to generate the token for.
   * @return {Promise<string>} - The generated JWT token.
   */
  async generateTokens(payload: JwtPayload, userId) {
    const secret = this.config.get('jwt.secret');
    const expiresIn = this.config.get('jwt.expiresIn');
    const refreshExpiresIn = this.config.get('jwt.refreshExpiresIn');
    const accessToken = this.jwtService.sign(payload, {expiresIn, secret});
    const refreshToken = this.jwtService.sign(
        payload,
        {expiresIn: refreshExpiresIn, secret}
    );
    const refreshTokenEntity = await this.refreshTokenRepository.create({
      userId: userId,
      refreshToken,
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);
    return {accessToken, refreshToken};
  }

  /**
   * Registers a user.
   * @param {RegisterDto} dto - The user to register.
   * @return {Promise<{ access_token: string }>} - The generated JWT token.
   * @throws {Error} - If the user already exists.
   */
  async register(dto: RegisterDto) {
    const user = await this.userRepository.findOne({where: {email: dto.email}});
    // If the user already exists, throw an error
    if (user) {
      throw new ApplicationErrorException(
          'E_0004',
          undefined,
          HttpStatus.UNAUTHORIZED
      );
    } else {
      const password = bcrypt.hashSync(dto.password, 15);
      const user = await this.userRepository.create({
        userName: dto.userName,
        email: dto.email,
        password: password,
        provider: 'local',
      });
      await this.userRepository.save(user);
      const payload:JwtPayload = {
        userName: dto.userName,
        provider: 'local',
        email: dto.email};
      // If the user doesn't exist, generate a JWT token
      return this.generateTokens(payload, user.id);
    }
  }

  /**
   * Refreshes a JWT token.
   * @param {RefreshTokenDto} dto - The refresh token DTO.
   * @return {Promise<{ accessToken: string }>} - The generated JWT token.
   * @throws {Error} - If the token is invalid.
   */
  async refresh(dto: RefreshTokenDto) {
    const refreshtoken = await this.refreshTokenRepository.findOne({where: {
      refreshToken: dto.refreshToken,
    }});
    if (refreshtoken) {
      const payload = {username: refreshtoken.userId, sub: refreshtoken.userId};
      return {
        accessToken: this.jwtService.sign(payload),
      };
    }
  }
}

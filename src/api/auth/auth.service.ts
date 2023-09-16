import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import {  Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';


@Injectable()
/**
 * Service for handling authentication-related functionality.
 */
export class AuthService {
  /**
   * Creates an instance of AuthService.
   * @param {JwtService} jwtService - The JWT service instance.
   * @param {Repository<User>} userRepository - The injected User repository instance.
   */
  constructor(private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    ) {}

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
   
    const user  =await this.userRepository.findOne({ where:{googleId: profile.id}  });
    
    if (!user) {
      // If the user doesn't exist, create a new user with the Google profile data
      const user = this.userRepository.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        // Add other profile data as needed
      });

      // Save the new user to the database
      await this.userRepository.save(user);
    }

    return user;
  }

  /**
   * Logs in a user.
   * @param {LoginDto} dto - The user to login.
   * @param {string} provider - The provider of the user.
   * @return {Promise<{ access_token: string }>} - The generated JWT token.
   * @throws {Error} - If the user doesn't exist.
   */
  async login(dto: LoginDto,provider:'google'|'local') {
    const payload = { username: dto.email, sub: dto.password,provider };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * Registers a user.
   * @param {any} dto - The user to register.
   * @return {Promise<{ access_token: string }>} - The generated JWT token.
   * @throws {Error} - If the user already exists.
   */ 
  async register(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where:{email: dto.email}  });
    if (user) {
      throw new Error('User already exists');
    }

    const newUser = this.userRepository.create({
      email: dto.email,
      password: dto.password,
    });

    await this.userRepository.save(newUser);

    const payload = { username: dto.email, sub: dto.password };
    return {
      accessToken: this.jwtService.sign(payload),
      
    };
  }

}

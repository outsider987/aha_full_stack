import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthGuard} from '@nestjs/passport';
import {LoginDto} from './dtos/login.dto';
import {successResponse} from 'src/utils/response';

@Controller('auth')
/**
 * Controller for handling authentication related requests.
 */
export class AuthController {
  /**
     * AuthController constructor.
     * @param {AuthService} authService - The injected AuthService instance.
     */
  constructor(private readonly authService: AuthService) {}

    /**
     * Login endpoint for generating a JWT token.
     * @param {LoginDto} dto - The login DTO.
     * @return {Promise<{ token: string }>} - The generated JWT token.
     */
    @Post('login')
    /**
     * Login endpoint for generating a JWT token.
     * @param {LoginDto} dto - The login DTO.
     * @return {Promise<{ accessToken: string }>} - The generated JWT token.
     */
  async login(@Body() dto: LoginDto) {
    const {accessToken} = await this.authService.login(dto, 'local');
    return successResponse({data: accessToken});
  }

    /**
     * Register endpoint for generating a JWT token.
     *  @param {any} req - The request object.
     * @return {Promise<{ token: string }>} - The generated JWT token.
     * @throws {Error} - If the user already exists.
     */
    @Post('register')
    async register(@Req() req: any) {
      const token = await this.authService.register(req.body);
      return {token};
    }

    /**
     * Login endpoint for generating a JWT token.
     */
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleLogin() {}

    /**
     * Login endpoint for generating a JWT token.
     * @param {any} req - The request object.
     * @return {Promise<{ token: string }>} - The generated JWT token.
     * @throws {Error} - If the user already exists.
     */
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req: any) {
      return this.authService.login(req.user, 'google');
    }
}

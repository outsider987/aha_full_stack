import {Controller, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthGuard} from '@nestjs/passport';


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
   * @param {any} req - The request object.
   * @return {Promise<{ token: string }>} - The generated JWT token.
   */
  @Post('login')
  @UseGuards(AuthGuard('jwt'))
  async login(@Req() req: any): Promise<{ token: string }> {
    const token = await this.authService.generateJwtToken(req.user.sub);
    return {token};
  }
}

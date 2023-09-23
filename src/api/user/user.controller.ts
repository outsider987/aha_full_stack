import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {ChangeNameDto} from './dto/changeName.dto';
import {UserService} from './user.service';
import {JwtGuard} from '../auth/guard/jwt.guard';
import {
  ApplicationErrorException,
} from 'src/exceptions/application-error.exception';
import * as jwt from 'jsonwebtoken';
import {ConfigService} from '@nestjs/config';
import {JwtPayload} from '../auth/interface';

@Controller('user')
/**
 * Controller for handling authentication related requests.
 */
export class UserController {
  /**
     * UserController constructor.
     * @param {UserService} userService - The injected UserService instance.
     */
  constructor(
    private readonly userService:UserService,
    private readonly config:ConfigService,
  ) {}

  /**
   * Login endpoint for generating a JWT token.
   * @param {Req} req - The request object.
   * @param {LoginDto} dto - The login DTO.
   * @return {Promise<{ accessToken: string }>} - The generated JWT token.
   */
  @Post('changeName')
  @UseGuards(JwtGuard)
  async modifiName(@Req() req, @Body()dto:ChangeNameDto) {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) {
      throw new ApplicationErrorException('E_0007');
    }
    const secret= this.config.get('jwt.secret');
    const decoded = jwt.verify(token, secret) as JwtPayload;

    return this.userService.modifiName(dto, decoded.email);
  }
}



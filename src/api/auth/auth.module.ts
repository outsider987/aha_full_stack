import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JwtStrategy} from './strategy/jwt.strategy';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'src/entities/user.entity';
import {RefreshToken} from 'src/entities/refreshTokens.entity';
import {ConfigModule} from '@nestjs/config';
import {GoogleStrategy} from './strategy/google.strategy';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.AUTH0_SECRET, // Your Auth0 secret
      signOptions: {expiresIn: '1h'},
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  exports: [PassportModule, JwtModule],
})

/**
 * Auth module.
 */
export class AuthModule {}


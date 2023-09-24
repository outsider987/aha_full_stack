import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JwtStrategy} from './strategy/jwt.strategy';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'src/entities/user.entity';
import {ConfigModule} from '@nestjs/config';
import {GoogleStrategy} from './strategy/google.strategy';
import {EmailService} from '../email/email.service';
import {VerifyEmail} from 'src/entities/verifyEmail.entity';
import {LoginInformation} from 'src/entities/loginInformation.entity';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.AUTH0_SECRET,
      signOptions: {expiresIn: '1h'},
    }),
    TypeOrmModule.forFeature([User, VerifyEmail, LoginInformation]),
    ConfigModule,

  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, EmailService],
  exports: [PassportModule, JwtModule],
})

/**
 * Auth module.
 */
export class AuthModule {

}


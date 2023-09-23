import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'src/entities/user.entity';
import {ConfigModule} from '@nestjs/config';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([User]),
    ConfigModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})

/**
 * Auth module.
 */
export class AuthModule {}


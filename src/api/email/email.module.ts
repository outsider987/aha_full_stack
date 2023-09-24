import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from 'src/entities/user.entity';
import {EmailService} from '../email/email.service';
import {VerifyEmail} from 'src/entities/verifyEmail.entity';
import {LoginInformation} from 'src/entities/loginInformation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, VerifyEmail, LoginInformation]),

  ],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})

/**
 * USER module.
 */
export class EmailModule {}


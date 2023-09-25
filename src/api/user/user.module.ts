import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { ConfigModule } from "@nestjs/config";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";
import { AuthService } from "../auth/auth.service";
import { EmailService } from "../email/email.service";
import { VerifyEmail } from "src/entities/verifyEmail.entity";
import { LoginInformation } from "src/entities/loginInformation.entity";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    TypeOrmModule.forFeature([User, VerifyEmail, LoginInformation]),
    ConfigModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, EmailService],
  exports: [UserService],
})

/**
 * USER module.
 */
export class UserModule {}

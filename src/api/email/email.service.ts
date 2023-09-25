// email.service.ts
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as nodemailer from "nodemailer";
import { User } from "src/entities/user.entity";
import { VerifyEmail } from "src/entities/verifyEmail.entity";
import { Repository } from "typeorm";

@Injectable()
/**
 * Service for sending emails.
 */
export class EmailService {
  private transporter;

  /**
   * Constructor for the EmailService.
   * @param {ConfigService} config - The injected ConfigService instance.
   */
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(VerifyEmail)
    private readonly verifyEmailRepository: Repository<VerifyEmail>,
  ) {
    this.transporter = nodemailer.createTransport({
      // Configure your email provider (SMTP, Mailgun, SendGrid, etc.)
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: config.get("SENDGRID_API_KEY"),
      },
    });
  }

  /**
   * Sends a verification email to the specified email address.
   * @param {string}to The email address to send the verification email to.
   * @return {Promise<void>}
   * @constructor
   */
  async sendVerificationEmail(to: string) {
    const backEndPoint = this.config.get("backEndPoint");
    const verifyEmail = await this.createEmailToken(to, 1);
    const verificationLink = `${backEndPoint}/auth/verify-email/${verifyEmail.verificationToken}`;
    const mailOptions = {
      from: "t790219520@gmail.com",
      to,
      subject: "Email Verification",
      text: `Click the link to verify your email: ${verificationLink}`,
    };

    const res = await this.transporter.sendMail(mailOptions);
    console.log(res);
  }
  /**
   * Creates a token for the specified email address.
   * @param {string}email The email address to create the token for.
   * @param {number}userId The ID of the user to create the token for.
   */
  async createEmailToken(email: string, userId: number) {
    const verifyEmail = await this.verifyEmailRepository.create({
      verificationToken: Math.random().toString(36).substring(2, 15),
      email,
      user: { id: userId },
    });
    await this.verifyEmailRepository.save(verifyEmail);
    return verifyEmail;
  }

  /**
   * The verification token to find the email by.
   * @param {string} verificationToken
   * @return {Promise<VerifyEmail>}
   */
  async findByVerificationToken(verificationToken: string) {
    const verifyEmail = await this.verifyEmailRepository.findOne({
      where: { verificationToken },
    });
    if (verifyEmail) {
      this.verifyEmailRepository.remove(verifyEmail);
      this.userRepository.update(verifyEmail.user.id, {
        isEmailConfirmed: true,
      });
      return true;
    } else {
      return false;
    }
  }

  /**
   * Sends a reset password email to the specified email address.
   * @param {string}email
   */
  async sendResetPasswordEmail(email: string) {
    const frontEndPoint = this.config.get("frontEndPoint");
    const user = await this.userRepository.findOne({ where: { email } });
    user.resetPasswordToken = Math.random().toString(36).substring(2, 15);
    await this.userRepository.save(user);

    const resetPasswordLink = `
    ${frontEndPoint}/#/reset-password?token=
    ${user.resetPasswordToken}&
    email=${email}`.replace(/\s/g, "");
    console.log("resetPasswordLink:", resetPasswordLink);

    const mailOptions = {
      from: "t790219520@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `Click the link to reset your password: ${resetPasswordLink}`,
    };
    const res = await this.transporter.sendMail(mailOptions);
    console.log(res);
  }
}

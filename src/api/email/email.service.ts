// email.service.ts
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {InjectRepository} from '@nestjs/typeorm';
import * as nodemailer from 'nodemailer';
import {User} from 'src/entities/user.entity';
import {VerifyEmail} from 'src/entities/verifyEmail.entity';
import {Repository} from 'typeorm';


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
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: config.get('SENDGRID_API_KEY'),
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
    const frontEndPoint = this.config.get('frontEndPoint');
    const verificationLink = `${frontEndPoint}/verify-email?token=`;
    const mailOptions = {
      from: 'your_email@example.com',
      to,
      subject: 'Email Verification',
      text: `Click the link to verify your email: ${verificationLink}`,
    };

    await this.transporter.sendMail(mailOptions);
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
      user: {id: userId},
    });
    await this.verifyEmailRepository.save(verifyEmail);
    return verifyEmail;
  }

  /**
   * @param {string} verificationToken
   * The verification token to find the email by.
   * @return {Promise<VerifyEmail>}
   */
  async findByVerificationToken(verificationToken: string) {
    const verifyEmail = await this.verifyEmailRepository.findOne({
      where: {verificationToken},
    });
    if (verifyEmail) {
      this.verifyEmailRepository.remove(verifyEmail);
      this.userRepository.update(verifyEmail.user.id, {isEmailConfirmed: true});
      return true;
    } else {
      return false;
    }
  }
}

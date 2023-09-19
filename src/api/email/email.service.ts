// email.service.ts
import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as nodemailer from 'nodemailer';


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
  constructor(config: ConfigService) {
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
    * @param {string} verificationLink The link to verify the email address.
    * @return {Promise<void>}
    * @constructor
   */
  async sendVerificationEmail(to: string, verificationLink: string) {
    const mailOptions = {
      from: 'your_email@example.com',
      to,
      subject: 'Email Verification',
      text: `Click the link to verify your email: ${verificationLink}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

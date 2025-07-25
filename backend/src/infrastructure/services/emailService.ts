import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { IEmailService } from '../../application/services/IEmailService';
import logger from '../../logger';

dotenv.config();

export class EmailService implements IEmailService {
  private transporter;

  constructor() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials are missing in environment variables');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendDefaultPasswordEmail(to: string, password: string): Promise<void> {
    const mailOptions = {
      from: `"School Management" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Default Password',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Welcome to STM!</h2>
          <p>Your account has been created successfully.</p>
          <p><strong>Default Password:</strong> ${password}</p>
          <p>Please <strong>log in</strong> using this password and change it immediately for security reasons.</p>
          <hr/>
          <p style="font-size: 0.9rem; color: gray;">
            If you did not request this account or received this email by mistake, you can safely ignore it.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error('Error sending email:', error);
      throw new Error('Failed to send default password email');
    }
  }
}

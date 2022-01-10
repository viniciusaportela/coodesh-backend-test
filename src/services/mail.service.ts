import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { env } from '../config/env';

export default class MailService {
  static async send(optionsArg: Omit<Mail.Options, 'from'>) {
    if (env.gmailSenderEmail && env.gmailSenderPassword) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: env.gmailSenderEmail,
          pass: env.gmailSenderPassword,
        },
      });

      const mailOptions = {
        ...optionsArg,
        from: "Space Flight Articles Service",
      };
  
      await transporter.sendMail(mailOptions);
    } else {
      throw new Error("There is not mail credentials configured");
    }
  }
}
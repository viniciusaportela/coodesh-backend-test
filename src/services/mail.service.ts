import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { envConfig } from '../config/env';

export default class MailService {
  static async send(optionsArg: Omit<Mail.Options, 'from'>) {
    if (envConfig.gmailSenderEmail && envConfig.gmailSenderPassword) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: envConfig.gmailSenderEmail,
          pass: envConfig.gmailSenderPassword,
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
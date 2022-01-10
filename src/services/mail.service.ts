import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { config } from '../config/config';

export default class MailService {
  static async send(optionsArg: Omit<Mail.Options, 'from'>) {
    if (config.gmailSenderEmail && config.gmailSenderPassword) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.gmailSenderEmail,
          pass: config.gmailSenderPassword,
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
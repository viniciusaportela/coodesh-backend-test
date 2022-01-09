import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { config } from '../config/config';

export default class MailService {
  static async send(optionsArg: Omit<Mail.Options, 'from'>) {
    if (config.gmailEmail && config.gmailPassword) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.gmailEmail,
          pass: config.gmailPassword,
        },
      });

      const mailOptions = {
        ...optionsArg,
        from: "Flight Articles Service",
      };
  
      await transporter.sendMail(mailOptions);
    } else {
      throw new Error("There is not mail credentials configured");
    }
  }
}
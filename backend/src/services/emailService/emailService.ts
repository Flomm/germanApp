import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../../config';
import { IEmail } from '../../models/IEmail';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as mailJet from 'node-mailjet';
import IEmailReplacements from '../../models/IEmailReplacements';
import IMailjetMail from '../../models/IMailjetMail';

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

export const emailService = {
  //Old method with SMTP
  createTransporter(): void {
    transporter = nodemailer.createTransport(config.transporter);
  },

  sendEmail(email: IEmail): void {
    transporter.sendMail(email);
  },

  //New method with mailjet
  connectToMailJet(): void {
    mailJet.connect(
      process.env.EMAIL_API as string,
      process.env.EMAIL_SECRET as string,
    );
  },

  sendMailJetMail(email: IMailjetMail): void {
    mailJet
      .connect(
        config.mailJet.auth.apiKey as string,
        config.mailJet.auth.secretKey as string,
      )
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [email],
      });
  },

  readTemplate(templatePath: string, replacements: IEmailReplacements): string {
    const html: string = fs.readFileSync(
      path.join(__dirname, templatePath),
      'utf8',
    );
    const template: HandlebarsTemplateDelegate = handlebars.compile(html);
    return template(replacements);
  },
};

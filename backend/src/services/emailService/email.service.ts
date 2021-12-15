import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../../config';
import { IEmail } from '../../models/IEmail';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import IEmailReplacements from '../../models/IEmailReplacements';

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

export const emailService = {
  createTransporter(): void {
    transporter = nodemailer.createTransport(config.transporter);
  },

  sendEmail(email: IEmail): void {
    try {
      transporter.sendMail(email);
    } catch (err) {
      throw err;
    }
  },

  readTemplate(templatePath: string, replacements: IEmailReplacements): string {
    try {
      const html: string = fs.readFileSync(
        path.join(__dirname, templatePath),
        'utf8',
      );
      const template: HandlebarsTemplateDelegate = handlebars.compile(html);
      return template(replacements);
    } catch (err) {
      throw err;
    }
  },
};

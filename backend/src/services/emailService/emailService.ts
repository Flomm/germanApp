import config from '../../config';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as mailJet from 'node-mailjet';
import IEmailReplacements from '../../models/IEmailReplacements';
import IMailjetMail from '../../models/IMailjetMail';

let mailJetConnection: mailJet.Email.Client;

export const emailService = {
  connectToMailJet(): void {
    mailJetConnection = mailJet.connect(
      config.mailJet.auth.apiKey as string,
      config.mailJet.auth.secretKey as string,
    );
  },

  async sendMailJetMail(email: IMailjetMail): Promise<void> {
    try {
      await mailJetConnection.post('send', { version: 'v3.1' }).request({
        Messages: [email],
      });
      return;
    } catch (err) {
      return Promise.reject(err);
    }
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

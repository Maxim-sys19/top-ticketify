import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptionsFactory } from '@nestjs-modules/mailer';
import * as Handlebars from 'handlebars';
import { join } from 'path';
import { registerHbsPartialRecursive } from 'src/helpers/register.hbs.partial.recursive';

@Injectable()
export class MailConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMailerOptions() {
    const templatesDir = join(__dirname, '../templates');
    const partialsDir = join(templatesDir, 'partials');
    const layoutsDir = join(templatesDir, 'layouts');
    registerHbsPartialRecursive(partialsDir);
    registerHbsPartialRecursive(layoutsDir);
    // console.log(Handlebars);
    return {
      transport: {
        host: this.configService.get('smtp_mailer_host'),
        port: this.configService.get('smtp_mailer_port'),
        secure: false,
        auth: {
          user: '',
          pass: '',
        },
      },
      defaults: {
        from: 'No reply reply@example.com',
      },
      template: {
        dir: templatesDir,
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    };
  }
}

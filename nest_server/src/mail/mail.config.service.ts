import { Injectable } from '@nestjs/common';
// import * from ""
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptionsFactory } from '@nestjs-modules/mailer';
import * as process from 'node:process';
@Injectable()
export class MailConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMailerOptions() {
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
        dir: `${process.env.INIT_CWD}/src/templates`,
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    };
  }
}

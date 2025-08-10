import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { OauthService } from './oauth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly oauthService: OauthService,
  ) {
    super({
      clientID: configService.get('oauth_google_client_id'),
      clientSecret: configService.get('oauth_google_client_secret_key'),
      callbackURL: configService.get('oauth_google_callback_url'),
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      console.log('✅ validate вызван');
      // const user = await this.oauthService.validateOauthLogin(
      //   profile,
      //   AuthProvider.GOOGLE,
      // );
      // return done(null, user);
    } catch (error) {
      console.log('strategy error', error);
      return done(error, null);
    }
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { OauthService } from './oauth.service';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly oauthService: OauthService) {}
  @Post('google/login')
  async googleAuth(@Body('id_token') token: string) {
    return await this.oauthService.verifyGoogleIdToken(token);
  }
}

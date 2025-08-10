import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { AuthProviderEnums } from '../enums/auth.provider.enums';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../entities/role/role.entity';
import { UserRole } from '../enums/role.enums';
import { generateJti } from '../helpers/authHelpers';

@Injectable()
export class OauthService {
  private logger = new Logger(OauthService.name);
  private googleClient = new OAuth2Client(
    this.configService.get('oauth_google_client_id'),
  );
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async verifyGoogleIdToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get('oauth_google_client_id'),
      });
      const payload: TokenPayload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }
      const validatedUser = await this.validateOauthLoginUser(payload);
      const jwt_token = await this.jwtService.signAsync({
        user: validatedUser,
        jti: generateJti(),
      });
      return { email: validatedUser.email, token: jwt_token };
    } catch (error) {
      console.log('OAuthService.verifyGoogleIdToken :', error);
      this.logger.error(error.message, {
        statusCode: error.status,
        stack: error.stack,
      });
      throw new UnauthorizedException('Google token verification failed');
    }
  }
  private async validateOauthLoginUser(payload: TokenPayload) {
    const { name, email, picture } = payload;
    try {
      const foundedUser = await this.userRepository.findOne({
        where: { email },
      });
      if (!foundedUser) {
        const role = new Role();
        role.role_name = UserRole.USER;
        await this.roleRepository.save(role);
        const data = {
          name,
          email,
          avatar: picture,
          status: 'active',
          authProvider: AuthProviderEnums.GOOGLE,
          roles: [role],
        };
        const newUser = this.userRepository.create(data);
        return await this.userRepository.save(newUser);
      }
      return foundedUser;
    } catch (err) {
      console.log('validateOauthLogin err', err);
    }
  }
}

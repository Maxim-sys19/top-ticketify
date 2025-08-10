import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role/role.entity';
import { User } from '../entities/user/user.entity';
import { MailService } from '../mail/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { ResetPasswordToken } from '../entities/reset.password.token.entity';
import { UserRoles } from '../entities/user/user.roles.entity';
import { OAuthController } from './oauth.controller';
import { GoogleStrategy } from './google.strategy';
import { PassportModule } from '@nestjs/passport';
import { OauthService } from './oauth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRoles, Role, ResetPasswordToken]),
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>('jwt_secret'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    AuthService,
    OauthService,
    MailService,
    Logger,
    JwtStrategy,
    GoogleStrategy,
  ],
  controllers: [AuthController, OAuthController],
})
export class AuthModule {}

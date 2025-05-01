import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/auth/user.dto';
import { UserStatus } from '../enums/user.enums';
import {
  comparePassword,
  generateJti,
  generateResetToken,
  hashPwd,
} from '../helpers/authHelpers';
import { Role } from '../entities/role/role.entity';
import { MailService } from '../mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/auth/login.dto';
import { ResetPasswordToken } from '../entities/reset.password.token.entity';
import { addMinutes } from 'date-fns';
import { ResetPasswordDto } from '../dto/auth/reset.pwd.dto';
import { Redis } from 'ioredis';
import { UserRoles } from '../entities/user/user.roles.entity';
import { UserRole } from '../enums/role.enums';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly redisClient: Redis;

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserRoles)
    private userRoleRepository: Repository<UserRoles>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(ResetPasswordToken)
    private readonly resetPwdTokenRepository: Repository<ResetPasswordToken>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    @Inject('EMAIL_QUEUE_CLIENT') private client: ClientProxy,
  ) {
    this.redisClient = this.redisService.getOrThrow();
  }

  async register(dto: UserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (user) {
        throw new BadRequestException(
          `user with email ${dto.email} is already registered`,
        );
      }
      const role = new Role();
      role.role_name = UserRole.USER;
      await this.roleRepository.save(role);
      const hashedPwd = await hashPwd(dto.password, 10);
      const data = {
        email: dto.email,
        name: dto.name,
        password: hashedPwd,
        status: UserStatus.Pending,
        roles: [role],
      };
      const token = await this.jwtService.signAsync({
        email: dto.email,
      });
      const savedUser = await this.userRepository.save(data);
      setImmediate(() => {
        console.log('set immediate:');
        this.client.emit('email.verification', { user: data, token });
      });
      // await this.mailService.emailVerification(data, token);
      return savedUser;
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
        relations: ['roles'],
      });
      if (!user) {
        throw new NotFoundException(
          `User with email ${dto.email} is not found!`,
        );
      }
      if (user.status === UserStatus.Pending) {
        throw new BadRequestException(`Please confirm your email`);
      }
      const validPwd = await comparePassword(dto.password, user.password);
      if (!validPwd) {
        throw new BadRequestException(
          `Incorrect password for email ${dto.email}`,
        );
      }
      const payload = {
        user,
        jti: generateJti(),
      };
      const token = await this.jwtService.signAsync(payload);
      await this.redisClient
        .set(payload.jti, payload.jti, 'EX', 3600)
        .then((result) =>
          console.log(`JTI-${payload.jti} has been set success : `, result),
        )
        .catch((err) => {
          console.log('Failing set JTI :', err);
        });
      return { email: user.email, token };
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async logout(token: string) {
    const jwtToken = token.split(' ')[1];
    console.log(jwtToken);
  }

  async emailConfirmation(token: string) {
    try {
      const { email } = await this.jwtService
        .verifyAsync(token)
        .catch((err: any) => {
          throw new InternalServerErrorException(err.message);
        });
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new BadRequestException(`User with email ${email} is not found!`);
      }
      user.status = UserStatus.Active;
      await this.userRepository.save(user);
      return user;
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException(`User with email ${email} is not found!`);
      }
      const generateToken = generateResetToken();
      const expiresAt = addMinutes(new Date(), 15);
      const resetPasswordToken = new ResetPasswordToken();
      resetPasswordToken.userId = user.id;
      resetPasswordToken.token = generateToken;
      resetPasswordToken.expiresAt = expiresAt;
      await this.resetPwdTokenRepository.save(resetPasswordToken);
      const messageId = await this.mailService.emailResetPassword(
        user,
        generateToken,
      );
      return { success: true, id: messageId };
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const resetToken = await this.resetPwdTokenRepository.findOne({
        where: { token: dto.reset_token },
      });
      if (!resetToken) {
        throw new NotFoundException('Invalid reset token');
      }
      const user = await this.userRepository.findOne({
        where: { id: resetToken.userId },
      });
      const verifyPwd = await comparePassword(dto.old_password, user.password);
      if (!verifyPwd) {
        throw new BadRequestException('No valid password');
      }
      if (dto.old_password === dto.new_password) {
        throw new BadRequestException('The same password');
      }
      user.password = await hashPwd(dto.new_password, 10);
      return await this.userRepository.save(user).then((result) => {
        return {
          success: true,
          message: `Password of user - ${result.email} reset successfully`,
        };
      });
    } catch (err) {
      this.logger.error(err.message, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new HttpException(err.message, err.status);
    }
  }
}

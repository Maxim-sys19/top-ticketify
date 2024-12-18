import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    // const request = context.switchToHttp().getRequest();
    // const token = request.headers.authorization?.split(' ')[1];
    if (err) {
      this.logger.error(err.response, {
        statusCode: err.status,
        stack: err.stack,
      });
      throw new UnauthorizedException(err.response, err.status);
    }
    if (info || !user) {
      this.logger.error(info.message, {
        statusCode: 500,
        stack: info.stack,
      });
      throw err || new UnauthorizedException();
    }
    user.password = '';
    return user;
  }
}

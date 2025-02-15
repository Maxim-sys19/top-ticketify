import { ResetPasswordToken } from '../entities/reset.password.token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ResetExpiredPwdService {
  // private readonly logger = new Logger(ResetExpiredPwdService.name);

  constructor(
    @InjectRepository(ResetPasswordToken)
    private resetPasswordTokenRepository: Repository<ResetPasswordToken>,
  ) {}

  async deleteExpiredResetPwdToken() {
    const now = new Date();
     await this.resetPasswordTokenRepository
      .createQueryBuilder()
      .delete()
      .from(ResetPasswordToken)
      .where('expiresAt <= :now', { now })
      .execute()
      .then((result) => {
        console.log('Expired token deleted: ', JSON.stringify(result));
      });
  }
}

import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyUser } from '../entities/user/company.user';
import { Company } from '../entities/company/company.entity';
import { Role } from '../entities/role/role.entity';
import { UserRoles } from '../entities/user/user.roles.entity';
import { User } from '../entities/user/user.entity';
import { MyCompanyController } from './my.company.controller';
import { JwtStrategy } from '../auth/jwt.strategy';
import { CompanyTransports } from 'src/entities/company/company.transports';
import { TransportSeats } from 'src/entities/transport/transport.seats';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyUser, CompanyTransports, TransportSeats, Company, Role, User, UserRoles]),
  ],
  controllers: [CompanyController, MyCompanyController],
  providers: [CompanyService, JwtStrategy],
})
export class CompanyModule {}

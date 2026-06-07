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
import { TransportCompany } from 'src/entities/transport/transport.company';
import { Seat } from 'src/entities/seat/seat.entity';
import { CompanyTransportsSeatsService } from 'src/company/company.transports.seats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyUser,
      CompanyTransports,
      TransportSeats,
      TransportCompany,
      Company,
      Role,
      User,
      Seat,
      UserRoles,
    ]),
  ],
  controllers: [CompanyController, MyCompanyController],
  providers: [CompanyService, CompanyTransportsSeatsService, JwtStrategy],
})
export class CompanyModule {}

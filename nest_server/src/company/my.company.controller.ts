import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {CompanyService} from './company.service';
import {JwtAuthGuard} from '../guards/jwt.auth.guard';
import {RolesGuard} from 'src/guards/rolesGuard';
import {UserRole} from 'src/enums/role.enums';
import {Roles} from 'src/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('my-company')
export class MyCompanyController {
  constructor(private readonly companyService: CompanyService) {
  }

  @Get()
  @Roles(UserRole.COMPANY_USER)
  async myCompany(@Request() req: any) {
    const {user} = req;
    return await this.companyService.myCompany(user.id);
  }
}

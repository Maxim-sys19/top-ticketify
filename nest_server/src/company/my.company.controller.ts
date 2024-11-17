import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('my-company')
export class MyCompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async myCompany(@Request() req: any) {
    const { user } = req;
    return await this.companyService.myCompany(user.id);
  }
}

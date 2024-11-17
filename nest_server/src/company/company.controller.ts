import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UpdateCompany } from './dto/update-company';
import { RolesGuard } from '../guards/rolesGuard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/role.enums';

@Controller('company')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Roles(UserRole.ADMIN_USER, UserRole.COMPANY_USER)
  async create(@Body() createCompanyUserDto: CreateCompanyUserDto) {
    return this.companyService.create(createCompanyUserDto).then((company) => {
      return company;
    });
  }
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN_USER, UserRole.COMPANY_USER)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompany) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_USER)
  async remove(@Param('id') id: string) {
    return this.companyService.remove(+id).then((result) => {
      return result;
    });
  }
}

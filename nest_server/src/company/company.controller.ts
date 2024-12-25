import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { UpdateCompany } from './dto/update-company';
import { RolesGuard } from '../guards/rolesGuard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/role.enums';
import { PaginationDto } from '../dto/pagination/pagination.dto';
import { BulkDeleteDto } from '../dto/bulk-delete.dto';

@Controller('company')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Roles(UserRole.ADMIN_USER, UserRole.COMPANY_USER)
  async create(@Body() createCompanyUserDto: CreateCompanyUserDto) {
    return this.companyService.create(createCompanyUserDto);
  }
  @Get()
  findAll(@Query() query: PaginationDto) {
    const { limit, page } = query;
    console.log('limit :', limit);
    console.log('page :', page);
    return this.companyService.findAll(query);
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

  @Delete('bulk-delete')
  @Roles(UserRole.ADMIN_USER)
  async remove(@Body() body: BulkDeleteDto) {
    const { ids } = body;
    return this.companyService.remove(ids).then((result) => {
      return result;
    });
  }
}

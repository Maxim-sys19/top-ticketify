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
import { TransportService } from './transport.service';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { RolesGuard } from '../guards/rolesGuard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/role.enums';
import { PaginationDto } from '../dto/pagination/pagination.dto';
import { Pagination, PaginationParams } from '../decorators/pagination';
import { BulkDeleteDto } from 'src/dto/bulk-delete.dto';

@Controller('transport')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Post()
  @Roles(UserRole.ADMIN_USER, UserRole.COMPANY_USER)
  create(@Body() createTransportDto: CreateTransportDto) {
    return this.transportService.create(createTransportDto);
  }

  @Get()
  @Roles(UserRole.ADMIN_USER, UserRole.COMPANY_USER)
  findAll(@Pagination() params: PaginationParams) {
    return this.transportService.findAll(params);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN_USER, UserRole.COMPANY_USER)
  findOne(@Param('id') id: string) {
    return this.transportService.findOne(+id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN_USER, UserRole.COMPANY_USER)
  update(
    @Param('id') id: string,
    @Body() updateTransportDto: UpdateTransportDto,
  ) {
    return this.transportService.update(+id, updateTransportDto);
  }

  @Delete('/bulk-delete')
  @Roles(UserRole.ADMIN_USER, UserRole.COMPANY_USER)
  remove(@Body() body: BulkDeleteDto) {
    const {ids} = body
    return this.transportService.remove(ids);
  }
}

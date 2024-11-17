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
import { TransportService } from './transport.service';
import { CreateTransportDto } from './dto/create-transport.dto';
import { UpdateTransportDto } from './dto/update-transport.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { RolesGuard } from '../guards/rolesGuard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/role.enums';

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
  findAll() {
    return this.transportService.findAll();
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

  @Delete(':id')
  @Roles(UserRole.ADMIN_USER, UserRole.COMPANY_USER)
  remove(@Param('id') id: string) {
    return this.transportService.remove(+id);
  }
}

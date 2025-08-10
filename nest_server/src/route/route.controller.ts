import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RouteService } from './route.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Pagination, PaginationParams } from '../decorators/pagination';
import { BulkDeleteDto } from 'src/dto/bulk-delete.dto';

@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    // console.log('create new route ', createRouteDto);
    return this.routeService.create(createRouteDto);
  }

  @Get()
  findAll(@Pagination() params: PaginationParams) {
    return this.routeService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routeService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routeService.update(+id, updateRouteDto);
  }

  @Delete('bulk-delete')
  remove(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.routeService.remove(bulkDeleteDto);
  }
}

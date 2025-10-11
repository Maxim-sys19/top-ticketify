import {Module} from '@nestjs/common';
import {RouteService} from './route.service';
import {RouteController} from './route.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Route} from '../entities/route/route.entity';
import {GoogleMapsModule} from "src/google-maps/google-maps.module";

@Module({
  imports: [TypeOrmModule.forFeature([Route]), GoogleMapsModule],
  controllers: [RouteController],
  providers: [RouteService],
})
export class RouteModule {}

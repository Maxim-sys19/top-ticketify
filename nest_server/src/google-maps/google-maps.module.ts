import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GoogleMapsService } from 'src/google-maps/google-maps.service';

@Module({
  imports: [HttpModule],
  providers: [GoogleMapsService],
  exports: [GoogleMapsService],
})
export class GoogleMapsModule {}

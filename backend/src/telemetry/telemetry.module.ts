import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryController } from './telemetry.controller';
import { TelemetryService } from './telemetry.service';
import { DeviceData } from '../entities/device-data.entity';
import { Device } from '../entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceData, Device])],
  controllers: [TelemetryController],
  providers: [TelemetryService],
  exports: [TelemetryService],
})
export class TelemetryModule {}


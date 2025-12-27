import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TelemetryService } from './telemetry.service';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';

@Controller('api/telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  create(@Body() createTelemetryDto: CreateTelemetryDto) {
    // This endpoint can be called without auth for device simulators
    return this.telemetryService.create(createTelemetryDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findByDevice(
    @Query('deviceId') deviceId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.telemetryService.findByDevice(deviceId, fromDate, toDate);
  }
}


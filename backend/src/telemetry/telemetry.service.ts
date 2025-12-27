import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DeviceData } from '../entities/device-data.entity';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectRepository(DeviceData)
    private deviceDataRepository: Repository<DeviceData>,
  ) {}

  async create(createTelemetryDto: CreateTelemetryDto): Promise<DeviceData> {
    const deviceData = this.deviceDataRepository.create({
      deviceId: createTelemetryDto.deviceId,
      ts: createTelemetryDto.ts ? new Date(createTelemetryDto.ts) : new Date(),
      payload: createTelemetryDto.metrics || {},
    });
    return this.deviceDataRepository.save(deviceData);
  }

  async findByDevice(
    deviceId: string,
    from?: Date,
    to?: Date,
  ): Promise<DeviceData[]> {
    const where: any = { deviceId };
    if (from && to) {
      where.ts = Between(from, to);
    } else if (from) {
      where.ts = Between(from, new Date());
    }

    return this.deviceDataRepository.find({
      where,
      order: { ts: 'DESC' },
      take: 1000, // Limit to last 1000 records
    });
  }
}


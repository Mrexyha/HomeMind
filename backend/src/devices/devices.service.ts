import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../entities/device.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceCommandDto } from './dto/device-command.dto';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
  ) {}

  async findAll(): Promise<Device[]> {
    return this.devicesRepository.find();
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.devicesRepository.findOne({ where: { id } });
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    return device;
  }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const device = this.devicesRepository.create({
      ...createDeviceDto,
      state: createDeviceDto.state || {},
    });
    return this.devicesRepository.save(device);
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(id);
    Object.assign(device, updateDeviceDto);
    return this.devicesRepository.save(device);
  }

  async remove(id: string): Promise<void> {
    const device = await this.findOne(id);
    await this.devicesRepository.remove(device);
  }

  async sendCommand(id: string, commandDto: DeviceCommandDto): Promise<Device> {
    const device = await this.findOne(id);
    
    if (commandDto.command === 'set' && commandDto.payload) {
      device.state = { ...device.state, ...commandDto.payload };
    } else if (commandDto.command === 'toggle') {
      if (device.state?.on !== undefined) {
        device.state = { ...device.state, on: !device.state.on };
      }
    }
    
    return this.devicesRepository.save(device);
  }
}


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Automation } from '../entities/automation.entity';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { DevicesService } from '../devices/devices.service';

@Injectable()
export class AutomationsService {
  constructor(
    @InjectRepository(Automation)
    private automationsRepository: Repository<Automation>,
    private devicesService: DevicesService,
  ) {}

  async findAll(ownerId?: string): Promise<Automation[]> {
    if (ownerId) {
      return this.automationsRepository.find({ where: { ownerId } });
    }
    return this.automationsRepository.find();
  }

  async findOne(id: string): Promise<Automation> {
    const automation = await this.automationsRepository.findOne({
      where: { id },
    });
    if (!automation) {
      throw new NotFoundException('Automation not found');
    }
    return automation;
  }

  async create(
    createAutomationDto: CreateAutomationDto,
    ownerId: string,
  ): Promise<Automation> {
    const automation = this.automationsRepository.create({
      ...createAutomationDto,
      ownerId,
    });
    return this.automationsRepository.save(automation);
  }

  async update(
    id: string,
    updateAutomationDto: UpdateAutomationDto,
  ): Promise<Automation> {
    const automation = await this.findOne(id);
    Object.assign(automation, updateAutomationDto);
    return this.automationsRepository.save(automation);
  }

  async remove(id: string): Promise<void> {
    const automation = await this.findOne(id);
    await this.automationsRepository.remove(automation);
  }

  async executeAutomation(id: string): Promise<void> {
    const automation = await this.findOne(id);
    if (!automation.enabled) {
      return;
    }

    // Simple trigger check (can be extended)
    const now = new Date();
    if (automation.trigger.type === 'time') {
      const [hours, minutes] = automation.trigger.value.split(':');
      const triggerTime = new Date();
      triggerTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Check if time matches (within 1 minute)
      const diff = Math.abs(now.getTime() - triggerTime.getTime());
      if (diff > 60000) {
        return;
      }
    }

    // Execute actions
    for (const action of automation.actions) {
      if (action.deviceId && action.command) {
        await this.devicesService.sendCommand(action.deviceId, {
          command: 'set',
          payload: action.command,
        });
      }
    }
  }
}


import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AutomationsService } from './automations.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';

@Controller('api/automations')
@UseGuards(AuthGuard('jwt'))
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Post()
  create(@Body() createAutomationDto: CreateAutomationDto, @Request() req) {
    return this.automationsService.create(createAutomationDto, req.user.id);
  }

  @Get()
  findAll(@Request() req) {
    return this.automationsService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.automationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAutomationDto: UpdateAutomationDto,
  ) {
    return this.automationsService.update(id, updateAutomationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.automationsService.remove(id);
  }

  @Post(':id/execute')
  execute(@Param('id') id: string) {
    return this.automationsService.executeAutomation(id);
  }
}


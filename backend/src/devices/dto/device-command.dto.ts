import { IsString, IsObject, IsIn, IsOptional } from 'class-validator';

export class DeviceCommandDto {
  @IsString()
  @IsIn(['set', 'toggle', 'get'])
  command: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}


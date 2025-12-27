import { IsString, IsObject, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateAutomationDto {
  @IsString()
  name: string;

  @IsObject()
  trigger: {
    type: string;
    value: any;
  };

  @IsOptional()
  @IsArray()
  conditions?: Record<string, any>[];

  @IsArray()
  actions: Array<{
    deviceId: string;
    command: Record<string, any>;
  }>;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}


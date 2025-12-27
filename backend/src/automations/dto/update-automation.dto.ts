import { IsString, IsObject, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class UpdateAutomationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  trigger?: {
    type: string;
    value: any;
  };

  @IsOptional()
  @IsArray()
  conditions?: Record<string, any>[];

  @IsOptional()
  @IsArray()
  actions?: Array<{
    deviceId: string;
    command: Record<string, any>;
  }>;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}


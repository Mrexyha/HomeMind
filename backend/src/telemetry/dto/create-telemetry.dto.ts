import { IsString, IsObject, IsOptional, IsDateString } from 'class-validator';

export class CreateTelemetryDto {
  @IsString()
  deviceId: string;

  @IsOptional()
  @IsDateString()
  ts?: string;

  @IsObject()
  metrics: Record<string, any>;
}


import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateDeviceDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  room: string;

  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;

  @IsOptional()
  @IsObject()
  state?: Record<string, any>;
}


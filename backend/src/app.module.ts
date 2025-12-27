import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { getDatabaseConfig } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { AutomationsModule } from './automations/automations.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { User } from './entities/user.entity';
import { Device } from './entities/device.entity';
import { DeviceData } from './entities/device-data.entity';
import { Automation } from './entities/automation.entity';
import { Scene } from './entities/scene.entity';
import { Log } from './entities/log.entity';
import { MlModel } from './entities/ml-model.entity';
import { ModelRun } from './entities/model-run.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Device,
      DeviceData,
      Automation,
      Scene,
      Log,
      MlModel,
      ModelRun,
    ]),
    AuthModule,
    UsersModule,
    DevicesModule,
    AutomationsModule,
    TelemetryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Device } from './device.entity';

@Entity('device_data')
@Index(['deviceId', 'ts'])
export class DeviceData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deviceId: string;

  @ManyToOne(() => Device)
  @JoinColumn({ name: 'deviceId' })
  device: Device;

  @Column({ type: 'timestamp' })
  @Index()
  ts: Date;

  @Column('jsonb')
  payload: Record<string, any>;
}


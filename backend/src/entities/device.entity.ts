import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string; // light, thermostat, lock, sensor, etc.

  @Column()
  room: string;

  @Column('jsonb', { nullable: true })
  meta: Record<string, any>;

  @Column('jsonb', { default: {} })
  state: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}


import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('ml_models')
export class MlModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column('jsonb', { nullable: true })
  metrics: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  lastTrainedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}


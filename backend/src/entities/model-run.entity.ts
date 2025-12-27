import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { MlModel } from './ml-model.entity';

@Entity('model_runs')
export class ModelRun {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  modelId: string;

  @ManyToOne(() => MlModel)
  @JoinColumn({ name: 'modelId' })
  model: MlModel;

  @Column({ default: 'pending' })
  status: string; // pending, running, completed, failed

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date;

  @Column('text', { nullable: true })
  logs: string;

  @CreateDateColumn()
  createdAt: Date;
}


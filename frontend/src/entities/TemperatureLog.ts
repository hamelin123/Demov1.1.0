// backend/src/entities/TemperatureLog.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './Order';
import { User } from './User';

@Entity('temperature_logs')
export class TemperatureLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  order_id: string;

  @ManyToOne(() => Order, order => order.temperature_logs)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ nullable: true })
  staff_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'staff_id' })
  staff: User;

  @Column('decimal', { precision: 5, scale: 2 })
  temperature: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  humidity?: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column({ default: false })
  is_alert: boolean;

  @Column({ default: 'manual', enum: ['manual', 'iot'] })
  input_method: string;

  @Column({ nullable: true })
  device_id?: string;

  @Column({ nullable: true })
  notes?: string;
}
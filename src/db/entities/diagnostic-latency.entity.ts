import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entidade de diagnóstico de latência.
 * Armazena informações sobre a latência de operações, incluindo timestamps de início e fim,
 * além do ID de correlação para rastreamento.
 */
@Entity({ name: 'diagnostic_latency' })
export class DiagnosticLatency {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 36 })
  testId!: string;

  @Column({ type: 'varchar', default: 36 })
  correlationId!: string;

  @Column({ type: 'timestamptz'})
  timestamp_start!: Date;

  @Column({ type: 'timestamptz'})
  timestamp_end!: Date;

  @Column({ type: 'int', default: 0 })
  latencyMs!: number;

  @Column({ type: 'json', nullable: true, default: () => "'{}'" })
  data?: Record<string, any>;
}

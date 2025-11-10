import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Entidade de diagnóstico de latência.
 * Armazena o número de hits (requisições / eventos), histórico de log em JSON
 * e timestamps de início e último registro.
 */
@Entity({ name: 'diagnostic_latency' })
export class DiagnosticLatency {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', default: 36 })
  correlationId!: string;

  @Column({ type: 'timestamptz'})
  timestamp_start!: Date;

  @Column({ type: 'timestamptz'})
  timestamp_end!: Date;

  @Column({ type: 'int', default: 0 })
  latencyMs!: number;
}

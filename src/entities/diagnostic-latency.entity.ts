import { Column, Entity, PrimaryColumn } from 'typeorm';

/**
 * Entidade de diagnóstico de latência.
 * Armazena o número de hits (requisições / eventos), histórico de log em JSON
 * e timestamps de início e último registro.
 */
@Entity({ name: 'diagnostic_latency' })
export class DiagnosticLatency {
  @PrimaryColumn({ type: 'varchar', length: 80 })
  id!: string;

  @Column({ type: 'int', default: 1 })
  hit!: number;

  /**
   * Histórico de ocorrências. Mantido como array JSON (jsonb) para facilitar append.
   */
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'::jsonb" })
  log!: any[];

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp_start!: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp_last!: Date;
}


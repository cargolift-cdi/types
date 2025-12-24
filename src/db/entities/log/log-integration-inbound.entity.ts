import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IntegrationStatus } from "../../../enum/integration.enums.js";


/**
 * Mantém o histórico de chamadas de integração de entrada (inbound).
 * Armazena o request e response para auditoria e troubleshooting.
 */
@Entity({ name: "log_integration_inbound" })
@Index(["system", "event", "action"])
@Index("idx_log_integration_inbound_correlation_id", ["correlationId"])
@Index(["status", "updatedAt"])
@Index(["system", "event", "updatedAt"])
export class LogIntegrationInbound {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Sistema de destino (e.g., 'erp', 'wms') */
  @Column({ name: "system", type: "varchar", length: 80 })
  system!: string;

  /** Evento (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  event!: string;

  /** Ação (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  action!: string;

  /** Correlation Id */
  @Column({ name: "correlation_id", type: "varchar", length: 36 })
  correlationId!: string;

  /** Timestamp de início da requisição */
  @Column({ name: "timestamp_start", type: "timestamptz" })
  timestampStart!: Date;

  /** Timestamp do último processamento ou da última tentativa */
  @Column({ name: "timestamp_last", type: "timestamptz", nullable: true })
  timestampLast?: Date | null;

  /** Duração total em milissegundos */
  @Column({ name: "duration_ms", type: "int", nullable: true })
  durationMs?: number | null;

  /** Duração da última tentativa em milissegundos */
  @Column({ name: "duration_last_ms", type: "int", nullable: true })
  durationLastMs?: number | null;

  /** Ação SOAP informada no envelope quando aplicável */
  @Column({ type: 'varchar', length: 120, nullable: true })
  soapAction?: string | null;

  /** Cabeçalhos enviados ao destino após sanitização */
  @Column({ type: 'text', nullable: true })
  headers?: string | null;

  /** Envelope da requisição */
  @Column({ type: 'text', nullable: true })
  envelope?: string | null;

  /** Corpo sanitizado da requisição sem o envelope */
  @Column({ type: 'text', nullable: true })
  payload?: string | null;

  /** Payload transformado em formato canônico após aplicação da transformação JSONata */
  @Column({ type: 'text', nullable: true })
  transformedPayload?: string | null;

  /** Payload após enriquecimento de regras do BRE */
  @Column({ type: 'text', nullable: true })
  enrichmentPayload?: string | null;

  /** Status final do processamento */
  @Column({ type: 'varchar', length: 10, nullable: false })
  status!: IntegrationStatus;

  /** Motivo do status (mensagem curta) */
  @Column({ type: 'varchar', length: 255, nullable: true })
  statusReason?: string | null;

  /** Mensagem completa do erro */
  @Column({ type: 'text', nullable: true })
  errorMessage?: string | null;

  /** Stack completo quando disponível (mantido para investigações) */
  @Column({ type: 'text', nullable: true })
  errorStack?: string | null;

  /** Classificação do erro para o mecanismo de DLQ/retry */
  @Column({ type: 'varchar', length: 20, nullable: true })
  errorClassification?: 'transient' | 'fatal' | 'business' | 'none';

  /** Indica se este log veio de um replay manual ou DLQ */
  @Column({ type: 'boolean', default: false })
  wasReplayedFromDlq!: boolean;  

  /** ID da tabela integration_inbound */
  @Column({ type: 'bigint' })
  inboundId!: string; // manter string no TS para bigint seguro

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IntegrationStatus } from "../enum/integration.enums.js";
import { ErrorSource, ErrorType } from "../enum/error-type.enum.js";


/**
 * Mantém o histórico de chamadas de integração de entrada (inbound).
 * Armazena o request e response para auditoria e troubleshooting.
 */
@Entity({ name: "log_integration_inbound" })
@Index(["id"], { unique: true })
@Index(["correlationId"], { unique: true })
@Index(["system", "event", "action"])
@Index(["status", "updatedAt"])
@Index(["system", "event", "updatedAt"])
export class LogIntegrationOutbound {
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

  /** Timestamp de início da requisição na API */
  @Column({ name: "timestamp_start", type: "timestamptz", nullable: true })
  timestampStart?: Date | string;
  
  /** Timestamp do início do processamento no ESB */
  @Column({ name: "timestamp_process", type: "timestamptz", nullable: true })
  timestampProcess?: Date | null;  

  /** Timestamp final do processamento no ESB */
  @Column({ name: "timestamp_end", type: "timestamptz", nullable: true })
  timestampEnd?: Date | null;

  /** Duração total em milissegundos */
  @Column({ name: "duration_request_ms", type: "int", nullable: true })
  durationRequest?: number | null;  

  /** Duração do processamento em milissegundos no ESB */
  @Column({ name: "duration_process_ms", type: "int", nullable: true })
  durationProcessMs?: number | null;

  /** Duração total em milissegundos */
  @Column({ name: "duration_ms", type: "int", nullable: true })
  durationMs?: number | null;  

  /** Status final do processamento */
  @Column({ type: 'varchar', length: 10, nullable: false })
  status!: IntegrationStatus;

  /** Motivo do status (mensagem curta) */
  @Column({ type: 'varchar', length: 255, nullable: true })
  statusReason?: string | null;

  /** Quantidade de tentativas realizadas até o sucesso ou falha definitiva */
  @Column({ type: 'int', nullable: true })
  retries?: number | null;  

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
  enrichedPayload?: string | null;

  /** Mensagem completa do erro */
  @Column({ type: 'text', nullable: true })
  errorMessage?: string | null;

  /** Stack completo quando disponível (mantido para investigações) */
  @Column({ type: 'text', nullable: true })
  errorStack?: string | null;

  /** Classificação do erro  */
  @Column({ type: 'varchar', length: 15, nullable: true })
  errorType?: ErrorType | null;

  /** Agente causador do erro */
  @Column({ type: 'varchar', length: 15, nullable: true })
  errorSource?: ErrorSource | null;

  /** Indica se este log veio de um replay manual ou DLQ */
  // @Column({ type: 'boolean', default: false })
  // wasReplayedFromDlq!: boolean;  

  /** ID da tabela integration_inbound */
  @Column({ type: 'bigint', nullable: true  })
  inboundId!: string; // manter string no TS para bigint seguro

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
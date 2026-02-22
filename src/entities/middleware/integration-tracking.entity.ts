import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IntegrationStatus } from "../../enum/integration.enums.js";
import { TrackingCurrentStep } from "../../enum/tracking.enums.js";
import { TrackingStep } from "../../interfaces/tracking.interface.js";

/**
 * Registro-mestre de rastreamento end-to-end de uma requisição de integração.
 *
 * Consolida o status agregado e a lista de steps percorridos por todos
 * os serviços do pipeline (API Hub → ESB → MDM / Connectors).
 *
 * - Consultável externamente pelo correlationId (via API REST para sistemas parceiros).
 * - Usado como base para disparo de webhooks ao final do pipeline.
 * - Mantido com retenção longa (ex: 365 dias) enquanto logs detalhados
 *   por serviço (log_routing_inbound, log_mdm, log_routing_outbound)
 *   podem ter retenção mais curta.
 */
@Entity({ name: "integration_tracking" })
@Index(["id"], { unique: true })
@Index(["correlationId"], { unique: true })
@Index(["agent", "entity", "action"])
@Index(["status", "updatedAt"])
@Index(["currentStep", "status"])
@Index(["agent", "entity", "updatedAt"])
export class IntegrationTracking {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Correlation ID — identificador único da requisição (UUID v4) */
  @Column({ name: "correlation_id", type: "varchar", length: 36 })
  correlationId!: string;

  /** Agente de origem — sistema que enviou a requisição (e.g., 'erp', 'wms') */
  @Column({ name: "agent", type: "varchar", length: 80 })
  agent!: string;

  /** Entidade processada (e.g., 'driver', 'trip', 'customer') */
  @Column({ type: "varchar", length: 80 })
  entity!: string;

  /** Ação solicitada (e.g., 'create', 'update', 'upsert', 'delete') */
  @Column({ type: "varchar", length: 40 })
  action!: string;

  /** Chave de negócio da entidade (preenchido quando disponível no pipeline) */
  @Column({ name: "business_key", type: "jsonb", nullable: true })
  businessKey?: Record<string, any> | null;

  /**
   * Referências externas para correlação (e.g., número de CTE, CNPJ, etc).
   * Formato chave-valor: { "cte": "000123", "cnpj": "12345678000199" }
   */
  @Column({ name: "external_reference", type: "jsonb", nullable: true })
  externalReference?: Record<string, any> | null;

  /**
   * Modo de roteamento utilizado no ESB:
   * - 'direct': para conectores sem passar pelo ODS
   * - 'ods': para ODS antes dos conectores
   * - 'mdm': para MDM Service
   */
  @Column({ name: "routing_mode", type: "varchar", length: 20, nullable: true })
  routingMode?: string | null;

  /** Status agregado da requisição — reflete o estado mais recente do pipeline */
  @Column({ type: "varchar", length: 10, nullable: false })
  status!: IntegrationStatus;

  /** Motivo do status (mensagem curta) */
  @Column({ name: "status_reason", type: "varchar", length: 255, nullable: true })
  statusReason?: string | null;

  /** Step atual onde a mensagem se encontra no pipeline */
  @Column({ name: "current_step", type: "varchar", length: 40, nullable: false })
  currentStep!: TrackingCurrentStep;

  /**
   * Array de steps percorridos no pipeline (JSONB).
   * Cada elemento é um TrackingStep com step, service, status, timestamps, etc.
   * Permite visualizar o histórico completo do processamento.
   *
   * Append atômico via SQL: `steps = steps || $1::jsonb`
   */
  @Column({ type: "jsonb", nullable: false, default: () => "'[]'" })
  steps!: TrackingStep[];

  /** Indica se webhook foi disparado para este tracking */
  @Column({ name: "webhook_delivered", type: "boolean", default: false })
  webhookDelivered!: boolean;

  /** Timestamp de quando o webhook foi entregue */
  @Column({ name: "webhook_delivered_at", type: "timestamptz", nullable: true })
  webhookDeliveredAt?: Date | null;

  /** Timestamp de origem — quando a requisição foi gerada pelo sistema parceiro */
  @Column({ name: "timestamp_origin_start", type: "timestamptz", nullable: true })
  timestampOriginStart?: Date | string;

  /** Timestamp de quando o pipeline concluiu (sucesso ou falha definitiva) */
  @Column({ name: "timestamp_end", type: "timestamptz", nullable: true })
  timestampEnd?: Date | null;

  /** Duração total do ciclo de vida end-to-end em milissegundos */
  @Column({ name: "duration_lifetime_ms", type: "int", nullable: true })
  durationLifetimeMs?: number | null;

  /** Política de retenção: 'long' (tracking) ou 'short' (logs detalhados) */
  @Column({ name: "retention_policy", type: "varchar", length: 20, default: "long" })
  retentionPolicy!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}

import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IntegrationStatus } from "../../enum/integration.enums.js";
import { ErrorSource, ErrorType } from "../../enum/error-type.enum.js";

/**
 * Mantém o histórico de chamadas de integração de entrada (inbound).
 * Armazena o request e response para auditoria e troubleshooting.
 */
@Entity({ name: "log_mdm" })
@Index(["id"], { unique: true })
@Index(["correlationId"], { unique: true })
@Index(["agent", "entity", "action"])
@Index(["status", "updatedAt"])
@Index(["agent", "entity", "updatedAt"])
export class LogMdm {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Sistema de destino (e.g., 'erp', 'wms') */
  @Column({ name: "agent", type: "varchar", length: 80 })
  agent!: string;

  /** Entidade (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  entity!: string;

  /** Ação (e.g., 'upsert', 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  action!: string;

  /** Operação CRUD  (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  operation!: string;

  /** Correlation Id */
  @Column({ name: "correlation_id", type: "varchar", length: 36 })
  correlationId!: string;

  @Column({ name: "record_id", type: "varchar", length: 100, nullable: true })
  recordId?: string | undefined; // ID do registro afetado (opcional, pode ser preenchido posteriormente para facilitar buscas)

  /** Business Key */
  @Column({ name: "business_key", type: "jsonb", nullable: true })
  businessKey?: Record<string, any> | null;

  /** Referências externas associadas a mensagem/requisição para facilitar buscas e correlações (e.g., número de CTE, número de NF-e, CNPJ, etc).
   * Formato: Chave-Valor (Tipo-Referência)
   * Exemplo: { "cte": "000123", "cnpj": "12345678000199" }
   */
  @Column({ name: "external_reference", type: "jsonb", nullable: true })
  externalReference?: Record<string, any> | null;

  /** Status final do processamento */
  @Column({ type: "varchar", length: 10, nullable: false })
  status!: IntegrationStatus;

  /** Motivo do status (mensagem curta) */
  @Column({ type: "varchar", length: 255, nullable: true })
  statusReason?: string | null;

  /** Quantidade de tentativas realizadas até o sucesso ou falha definitiva */
  @Column({ type: "int", nullable: true })
  retries?: number | null;

  /** Timestamp de início de origem onde a mensagem/requisição foi gerada */
  @Column({ name: "timestamp_origin_start", type: "timestamptz", nullable: true })
  timestampOriginStart?: Date | string;

  /** Timestamp do início do processamento  */
  @Column({ name: "timestamp_start", type: "timestamptz", nullable: true })
  timestampStart?: Date | null;

  /** Timestamp da última tentativa do processamento  */
  @Column({ name: "timestamp_last_attempt", type: "timestamptz", nullable: true })
  timestampLastAttempt?: Date | null;

  /** Timestamp final do processamento  */
  @Column({ name: "timestamp_end", type: "timestamptz", nullable: true })
  timestampEnd?: Date | null;

  /** Duração de processamento (único) em milissegundos */
  @Column({ name: "duration_ms", type: "int", nullable: true })
  durationMs?: number | null;
  
  /** Duração total que a mensagem levou para ser processada */
  @Column({ name: "duration_total_ms", type: "int", nullable: true })
  durationTotal?: number | null;
  
  /** Duração total do ciclo de vida end-to-end em milissegundos */
  @Column({ name: "duration_lifetime_ms", type: "int", nullable: true })
  durationLifetime?: number | null;

  /** Mensagens de avisos e alertas não críticas que ocorreram durante o ciclo de vida da mensagem dentro do MDM */
  @Column({ type: "text", nullable: true })
  warns?: string | null;  

  /** Cabeçalhos enviados ao destino após sanitização */
  @Column({ type: "text", nullable: true })
  headers?: string | null;

  /** Envelope da requisição */
  @Column({ type: "text", nullable: true })
  envelope?: string | null;

  /** paylaod final após todos os tratamentos (autorização, delta, etc) */
  @Column({ type: "text", nullable: true })
  payload?: string | null;

  /** Payload da message queue após passar pelo ESB */
  @Column({ type: "text", nullable: true })
  rawPayload?: string | null;

  /** Payload após a aplicação das permissões, remoção de campos sem permissão*/
  @Column({ type: "text", nullable: true })
  authorizedPayload?: string | null;

  /** Apenas campos modificados que sofreram alterações (update) */
  @Column({ type: "text", nullable: true })
  deltaPayload?: string | null;

  /** Resposta do TypeORM após a operação */
  @Column({ type: "text", nullable: true })
  operationResult?: string | null;

  /** Resposta recebida do sistema de destino */ /** Mensagem completa do erro */
  @Column({ type: "text", nullable: true })
  errorMessage?: string | null;

  /** Stack completo quando disponível (mantido para investigações) */
  @Column({ type: "text", nullable: true })
  errorStack?: string | null;

  /** Classificação do erro  */
  @Column({ type: "varchar", length: 15, nullable: true })
  errorType?: ErrorType | null;

  /** Agente causador do erro */
  @Column({ type: "varchar", length: 15, nullable: true })
  errorSource?: ErrorSource | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}

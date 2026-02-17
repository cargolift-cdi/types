import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IntegrationStatus } from "../../enum/integration.enums.js";
import { ErrorSource, ErrorType } from "../../enum/error-type.enum.js";


/**
 * Mantém o histórico de chamadas de integração de entrada (inbound).
 * Armazena o request e response para auditoria e troubleshooting.
 */
@Entity({ name: "log_integration_inbound" })
@Index(["id"], { unique: true })
@Index(["correlationId"], { unique: true })
@Index(["agent", "entity", "action"])
@Index(["externalReference", "entity", "action"])
@Index(["status", "updatedAt"])
@Index(["agent", "entity", "updatedAt"])
export class LogIntegrationInbound {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Agente de destino (e.g., 'erp', 'wms') */
  @Column({ name: "agent", type: "varchar", length: 80 })
  agent!: string;

  /** Entidade (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  entity!: string;

  @Column({ type: "varchar", length: 80 })
  method!: string;    

  /** Ação (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  action!: string;

  /** Correlation Id */
  @Column({ name: "correlation_id", type: "varchar", length: 36 })
  correlationId!: string;  

  /** Entidade de origem (antes do roteamento) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80, nullable: true })
  sourceEntity?: string | null;

  /** Ação de origem (antes do roteamento) (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40, nullable: true })
  sourceAction?: string | null;

  /**
   * Modo de roteamento utilizado
   * - 'direct': Roteia diretamente para agentes de destino sem passar pelo ODS
   * - 'ods': Roteia para o ODS (Operational Data Store) antes de enviar para agentes de destino
   * - 'mdm': Roteia para fila de dados mestres (MDM) antes de enviar para agentes de destino
   */
  @Column({ type: "varchar", length: 20, nullable: true })
  routingMode?: string | null;  

  /** Status final do processamento */
  @Column({ type: 'varchar', length: 10, nullable: false })
  status!: IntegrationStatus;

  /** Motivo do status (mensagem curta) */
  @Column({ type: 'varchar', length: 255, nullable: true })
  statusReason?: string | null;

  /** Quantidade de tentativas realizadas até o sucesso ou falha definitiva */
  @Column({ type: 'int', nullable: true })
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
  
  /** Mensagens de avisos e alertas não críticas */
  @Column({ type: 'text', nullable: true })
  warns?: string | null;

  /** Cabeçalhos do message broker (RabbitMQ) */
  @Column({ type: 'text', nullable: true })
  headers?: string | null;


  /** Envelope da requisição */
  @Column({ type: 'text', nullable: true })
  envelope?: string | null;

  /** Payload final após todos os tratamentos (transformações, enriquecimentos, etc) */
  @Column({ type: 'text', nullable: true })
  payload?: string | null;

  /** Corpo bruto da requisição recebido */
  @Column({ type: 'text', nullable: true })
  rawPayload?: string | null;     

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

  // Referência externa associada (código do cadastro, número do documento, etc)
  @Column({ type: 'varchar', length: 100, nullable: true })
  externalReference?: string | null;

  // Tipo da referência externa ('cpf', 'número do cte', etc)
  @Column({ type: 'varchar', length: 100, nullable: true })
  externalReferenceType?: string | null;

  /**
   * Referências externas adicionais associadas em formato JSON (e.g., múltiplos códigos relacionados)
   * Formato: Chave-Valor (Tipo-Referência)
   * Exemplo: { "cte": "000123", "cnpj": "12345678000199" }
   */
  // TODO: Criar migration para índice GIN
  @Column({ type: 'jsonb', nullable: true })
  additionalExternalReferences?: Record<string, any> | null;

  /** ID da tabela integration_inbound */
  @Column({ type: 'bigint', nullable: true  })
  inboundId!: string; // manter string no TS para bigint seguro

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
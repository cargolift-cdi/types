import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IntegrationStatus, TransportProtocol } from '../enum/integration.enums.js';


/**
 * Entidade de diagnóstico de latência.
 * Armazena informações sobre a latência de operações, incluindo timestamps de início e fim,
 * além do ID de correlação para rastreamento.
 */
@Entity({ name: 'log_integration_outbound' })
@Index(["system", "event", "action"])
@Index(["correlationId"])
@Index(["status", "updatedAt"])
@Index(["system", "event", "updatedAt"])
export class IntegrationConnectorLog {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string;

  /** Sistema de destino (e.g., 'erp', 'wms') */
  @Column({ name: "system", type: "varchar", length: 80 })
  system!: string;

  /** Evento (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  event!: string;

  /** Ação (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  action!: string;

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

  /** Status final da operação */
  @Column({ type: 'varchar', length: 10})
  status!: IntegrationStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  statusReason?: string | null;  

  /** Transporte de saída: 'REST' | 'SOAP' | 'AMQP' | etc */
  @Column({ name: "transport_protocol", type: "varchar", length: 20 })
  transportProtocol!: TransportProtocol;

  /** Método HTTP efetivamente disparado (GET/POST/PUT/...) */
  @Column({ type: 'varchar', length: 10, nullable: true })
  httpMethod?: string | null;

  /** Ação SOAP informada no envelope quando aplicável */
  @Column({ type: 'varchar', length: 120, nullable: true })
  soapAction?: string | null;

  /** URL final depois de aplicar templates, path params e query string */
  @Column({ type: 'text', nullable: true })
  url?: string | null;

  /** Cabeçalhos enviados ao destino após sanitização */
  @Column({ type: 'json', nullable: true })
  requestHeaders?: Record<string, string> | null;

  /** Query string resolvida (após merge com templates) */
  @Column({ type: 'json', nullable: true })
  requestQuery?: Record<string, unknown> | null;

  /** Payload enviado na requisição */
  @Column({ type: 'text', nullable: true })
  requestPayload?: string | null;

  /** Cabeçalhos recebidos da resposta */
  @Column({ type: 'json', nullable: true })
  responseHeaders?: Record<string, string> | null;

  /** Payload recebido da resposta */
  @Column({ type: 'text' })
  responsePayload?: string;

  /** Código HTTP retornado pelo destino */
  @Column({ type: 'int', nullable: true })
  httpStatusCode!: number;

  /** Quantidade de tentativas realizadas até o sucesso ou falha definitiva */
  @Column({ type: 'int', nullable: true })
  retries?: number | null;

  /** Categoria do erro técnico observado (ECONNRESET, TIMEOUT etc.) */
  @Column({ type: 'varchar', length: 120, nullable: true })
  errorType?: string | null;

  /** Mensagem de erro já sanitizada para suporte */
  @Column({ type: 'text', nullable: true })
  errorMessage?: string | null;

  /** Stack completo quando disponível (mantido para investigações profundas) */
  @Column({ type: 'text', nullable: true })
  errorStack?: string | null;

  /** Classificação do erro para o mecanismo de DLQ/retry */
  @Column({ type: 'varchar', length: 20, nullable: true })
  errorClassification?: 'transient' | 'fatal' | 'business' | 'none';

  /** Indica se este log veio de um replay manual ou DLQ */
  @Column({ type: 'boolean', default: false })
  wasReplayedFromDlq!: boolean;

  /** Espaço para dados específicos do conector (OAuth, throttling, etc.) */
  @Column({ type: 'json', nullable: true, default: () => "'{}'" })
  metadata?: Record<string, any>;

  /** Identificador do registro outbound associado */
  @Column({ type: 'bigint' })
  outboundId!: string;

  /** Identificador do endpoint utilizado */
  @Column({ type: 'bigint' })
  endpointId!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}

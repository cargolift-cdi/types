import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IntegrationStatus } from '../../../enum/integration.enums.js';


/**
 * Entidade de diagnóstico de latência.
 * Armazena informações sobre a latência de operações, incluindo timestamps de início e fim,
 * além do ID de correlação para rastreamento.
 */
@Entity({ name: 'integration_connector_log' })
@Index(["system", "event", "action"])
@Index(["correlationId"])
@Index(["status", "updatedAt"])
@Index(["system", "event", "updatedAt"])
export class DiagnosticLatency {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  /** Sistema de destino (e.g., 'erp', 'wms') */
  @Column({ name: "system", type: "varchar", length: 80 })
  system!: string;

  /** Evento (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  event!: string;

  /** Ação (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  action!: string;

  @Column({ type: 'varchar', length: 36 })
  correlationId!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  @Column({ type: 'text' })
  payload!: string;

  @Column({ type: 'text' })
  response!: string;

  /** Método HTTP efetivamente disparado (GET/POST/PUT/...) */
  @Column({ type: 'varchar', length: 10, nullable: true })
  httpMethod?: string | null;

  /** URL final depois de aplicar templates, path params e query string */
  @Column({ type: 'text', nullable: true })
  resolvedUrl?: string | null;

  /** Cabeçalhos enviados ao destino após sanitização */
  @Column({ type: 'json', nullable: true })
  requestHeaders?: Record<string, string> | null;

  /** Cabeçalhos recebidos da resposta */
  @Column({ type: 'json', nullable: true })
  responseHeaders?: Record<string, string> | null;

  /** Query string resolvida (após merge com templates) */
  @Column({ type: 'json', nullable: true })
  requestQuery?: Record<string, unknown> | null;

  /** Corpo de referência (sem dados sensíveis) usado para montar requests */
  @Column({ type: 'text', nullable: true })
  sanitizedBodyTemplate?: string | null;

  /** Ação SOAP informada no envelope quando aplicável */
  @Column({ type: 'varchar', length: 120, nullable: true })
  soapAction?: string | null;

  /** Nome do arquivo sob processamento (quando o conector envia anexo ou lote) */
  /*@Column({ type: 'varchar', length: 160, nullable: true })
  fileName?: string | null;*/

  @Column({ type: 'int', default: 0 })
  statusCode!: number;

  @Column({ type: 'int', default: 0 })
  latencyMs!: number;  

  @Column({ type: 'int', default: 0 })
  attempts!: number;  

  @Column({ type: 'varchar', length: 10})
  status!: IntegrationStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  statusReason!: string;

  @Column({ type: 'bigint' })
  endpointId!: string;

  /** Categoria do erro técnico observado (ECONNRESET, TIMEOUT etc.) */
  @Column({ type: 'varchar', length: 120, nullable: true })
  errorType?: string | null;

  /** Mensagem de erro já sanitizada para suporte */
  @Column({ type: 'text', nullable: true })
  errorMessage?: string | null;

  /** Stack completo quando disponível (mantido para investigações profundas) */
  @Column({ type: 'text', nullable: true })
  errorStack?: string | null;

  /** Código de erro funcional retornado pelo destino ou BRE */
  @Column({ type: 'varchar', length: 60, nullable: true })
  businessErrorCode?: string | null;

  /** Classificação do erro para o mecanismo de DLQ/retry */
  @Column({ type: 'varchar', length: 20, nullable: true })
  errorClassification?: 'transient' | 'fatal' | 'business' | 'none';

  /** Quantidade de vezes que a mensagem já foi reprocessada */
  @Column({ type: 'int', nullable: true })
  retrySequence?: number | null;

  /** Nome da política de retry aplicada (fixed, backoff, jitter etc.) */
  @Column({ type: 'varchar', length: 40, nullable: true })
  retryPolicy?: string | null;

  /** Momento em que a última tentativa aconteceu */
  @Column({ type: 'timestamptz', nullable: true })
  lastAttemptAt?: Date | null;

  /** Próxima execução agendada quando o item aguarda backoff */
  @Column({ type: 'timestamptz', nullable: true })
  retryScheduledFor?: Date | null;

  /** Indica se este log veio de um replay manual ou DLQ */
  @Column({ type: 'boolean', default: false })
  wasReplayedFromDlq!: boolean;

  @Column({ type: 'json', nullable: true, default: () => "'{}'" })
  data?: Record<string, any>;

  /** Espaço para dados específicos do conector (OAuth, throttling, etc.) */
  @Column({ type: 'json', nullable: true, default: () => "'{}'" })
  metadata?: Record<string, any>;
}

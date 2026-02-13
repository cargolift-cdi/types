/**
 * @fileoverview Entidade IntegrationOutbound - Define configurações de integração de saída (outbound)
 * @author Israel A. Possoli
 * @date 2026-01-06 * 

 * Definição de roteamento e configuração de entrega/saída para entidades de integração (Outbound).
 *
 * Representa uma rota/endpoint de destino para uma entidade específica, incluindo
 * informações de transporte, endpoint, credenciais, políticas de retry, rate-limiting,
 * circuit breaker, idempotência e configurações específicas por protocolo (HTTP, filas/streams).
 *
 * Observações importantes:
 * - A combinação (agent, entity, action) é única. Há também um índice condicional que garante
 *   unicidade quando active = true (ou seja, apenas uma rota ativa por chave).
 * - O campo `id` é um bigint no banco — no TypeScript é mantido como string para segurança.
 * 
 * @remarks
 * - Esta entidade centraliza tanto o roteamento (por agent/entity/action) quanto as políticas e
 *   configurações de entrega, permitindo múltiplos tipos de transporte e adaptações por destino.
 * - Campos JSONB (httpConfig, queueConfig, tls, retryPolicy, rateLimit, breakerPolicy, idempotency)
 *   devem seguir os formatos esperados pelo componente de entrega para serem interpretados corretamente.* 
 *
 * @property transportProtocol Protocolo de transporte usado para a entrega (ex.: 'REST', 'SOAP', 'AMQP', 'KAFKA').
 * @property endpoint Endpoint principal/URI/host/connection string dependente do protocolo:
 * - HTTP(S): baseUrl (ex.: https://api.exemplo.com)
 * - AMQP: amqp://broker:5672
 * - Kafka: broker1:9092,broker2:9092
 * - SQS/PubSub: ARN, tópico ou projeto+tópico
 *
 * @property httpConfig Configurações específicas quando transportProtocol é HTTP/REST.
 *
 * @property queueConfig Configurações para filas/streams quando transportProtocol é AMQP/Kafka/SQS/PubSub.
 *
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { TransportProtocol } from "../../enum/integration.enums.js";
import { BreakerPolicy, EndpointConfig, EndpointQueueConfig, EndpointTlsConfig, HttpConfig, RateLimit, RetryPolicy } from "../../interfaces/integration.interface.js";


/**
 * Definição de roteamento de saída por chave (entity) e destino.
 * Agora inclui também as configurações de Target/Delivery (protocolo, endpoint, políticas, etc.).
 */
@Entity({ name: "integration_endpoint" })
@Index("uq_integration_endpoint_active", ["agent", "entity", "action"], {
  unique: true,
  where: `"active" = true`,
})
export class IntegrationEndpoint {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro


  /** Agente de destino (e.g., 'erp', 'wms') */
  @Column({ name: "target_agent", type: "varchar", length: 80 })
  agent!: string;

  /** Entidade (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  entity!: string;

  /** Ação (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  action!: string;

  @Column({ type: "int", default: 1 })
  version!: number;    

  @Column({ type: "boolean", default: true })
  active!: boolean;

  /** ===================== Target/Delivery (simplificado no próprio Outbound) ===================== */

  /**
   * Transporte de saída: 'REST' | 'SOAP' | 'AMQP' | etc
   */
  @Column({ name: "transport_protocol", type: "varchar", length: 20 })
  transportProtocol!: TransportProtocol;

  /**
   * Endpoint principal:
   *  - http(s): baseUrl (ex.: https://api.exemplo.com)
   *  - amqp: uri/host (ex.: amqp://broker:5672)
   *  - kafka: bootstrap servers (ex.: broker1:9092,broker2:9092)
   *  - sqs/pubsub: pode ser arn/topic/queue ou projeto+tópico
   */
  @Column({ type: "varchar", length: 500 })
  endpoint!: string;

  /**
   * Referência a credenciais reutilizáveis (IntegrationCredential.id).
   */
  @Column({ name: "credential_id", type: "bigint", nullable: true })
  credentialId?: string | null;

  /**
   * Opções de TLS/MTLS, certificados, SNI etc.
   * Ex.: { rejectUnauthorized: true, ca?: string, cert?: string, key?: string, servername?: string }
   */
  @Column({ type: "jsonb", nullable: true })
  tls?: EndpointTlsConfig | null;  

  /**
   * Configurações gerais do endpoint
   */
  @Column({ name: "config", type: "jsonb", nullable: true })
  config?: EndpointConfig | null;

  // @Column({ name: "http_method", type: "varchar", length: 10, default: 'POST', nullable: true })
  // httpMethod!: HttpMethod | null;

  /**
   * Config HTTP específica (quando transport = 'REST'):
   */
  @Column({ name: "http_config", type: "jsonb", nullable: true })
  httpConfig?: HttpConfig | null;

  /**
   * Config de fila/stream (quando transport = 'amqp' | 'kafka' | 'sqs' | 'pubsub'):
   * {
   *   topic?: string, queue?: string, exchange?: string, routingKey?: string,
   *   partitionKey?: string, messageKey?: string,
   *   properties?: Record<string, any>, // amqp/kafka props
   * }
   */
  @Column({ name: "queue_config", type: "jsonb", nullable: true })
  queueConfig?: EndpointQueueConfig| null;

 
  /**
   * Política de retentativa:
   * { maxAttempts: 3, strategy: 'exponential' | 'fixed', delayMs: 1000, maxDelayMs?: 60000, jitter?: true }
   */
  @Column({ name: "retry_policy", type: "jsonb", nullable: true })
  retryPolicy?: RetryPolicy | null;

  /**
   * Rate limiting por rota:
   * { limit: 100, intervalMs: 1000, burst?: 50, key?: 'targetAgent' | 'endpoint' | 'custom' }
   */
  @Column({ name: "rate_limit", type: "jsonb", nullable: true })
  rateLimit?: RateLimit | null;

  /**
   * Política de circuit breaker opcional por endpoint.
   * { threshold?: number; openMs?: number; halfOpenMaxAttempts?: number }
   */
  @Column({ name: "breaker_policy", type: "jsonb", nullable: true })
  breakerPolicy?: BreakerPolicy | null;

  /**
   * Concorrência máxima local por endpoint nesta instância.
   * Controla quantas requisições simultâneas este endpoint pode ter por processo.
   * Default: 1 (serialização local).
   */
  @Column({ name: "max_concurrent_per_endpoint", type: "int", nullable: true })
  maxConcurrentPerEndpoint?: number | null;

  /**
   * Idempotência:
   * { strategy: 'header' | 'bodyHash' | 'custom', headerName?: 'Idempotency-Key', ttlMs?: 300000 }
   */
  /*
  @Column({ type: "jsonb", nullable: true })
  idempotency?: Record<string, any> | null;
  */

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

}
/**
 * Definição de roteamento e configuração de entrega/saída para eventos de integração (Outbound).
 *
 * Representa uma rota/endpoint de destino para um evento específico, incluindo
 * informações de transporte, endpoint, credenciais, políticas de retry, rate-limiting,
 * circuit breaker, idempotência e configurações específicas por protocolo (HTTP, filas/streams).
 *
 * Observações importantes:
 * - A combinação (system, event, action) é única. Há também um índice condicional que garante
 *   unicidade quando active = true (ou seja, apenas uma rota ativa por chave).
 * - O campo `id` é um bigint no banco — no TypeScript é mantido como string para segurança.
 * 
 * @remarks
 * - Esta entidade centraliza tanto o roteamento (por sistema/evento/ação) quanto as políticas e
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
 *   Estrutura típica:
 *   {
 *     method?: 'POST'|'PUT'|'PATCH'|'GET'|'DELETE',
 *     pathTemplate?: string,                // ex.: /v1/drivers/{{id}}
 *     headersTemplate?: Record<string,string>,
 *     queryTemplate?: Record<string,any>,
 *     bodyTemplate?: any,                   // JSONata / Liquid / Handlebars
 *     contentType?: string,                 // ex.: 'application/json'
 *     timeoutMs?: number,
 *     compression?: { type?: 'gzip'|'deflate'|'br' }
 *   }
 *
 * @property queueConfig Configurações para filas/streams quando transportProtocol é AMQP/Kafka/SQS/PubSub.
 *   Estrutura típica:
 *   {
 *     topic?: string,
 *     queue?: string,
 *     exchange?: string,
 *     routingKey?: string,
 *     partitionKey?: string,
 *     messageKey?: string,
 *     headersTemplate?: Record<string,string>,
 *     properties?: Record<string,any>, // propriedades específicas do broker
 *     payloadTemplate?: any
 *   }
 *
 * @example Exemplo de httpConfig:
 * {
 *   method: 'POST',
 *   pathTemplate: '/v1/drivers/{{id}}',
 *   headersTemplate: { 'Authorization': 'Bearer {{token}}', 'Content-Type': 'application/json' },
 *   bodyTemplate: { id: '{{id}}', name: '{{name}}' },
 *   timeoutMs: 5000
 * }
 *
 * @example Exemplo de queueConfig para Kafka:
 * {
 *   topic: 'drivers.created',
 *   partitionKey: '{{id}}',
 *   headersTemplate: { correlationId: '{{correlationId}}' },
 *   payloadTemplate: { id: '{{id}}', payload: '{{payload}}' }
 * }
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { HttpMethod, TransportProtocol } from "./integration.enums.js";
import { EndpointBreakerPolicy, EndpointHttpConfig, EndpointQueueConfig, EndpointRateLimitConfig, EndpointRetryPolicy, EndpointTlsConfig } from "./integration.interface.js";


/**
 * Definição de roteamento de saída por chave (evento) e destino.
 * Agora inclui também as configurações de Target/Delivery (protocolo, endpoint, templates, políticas, etc.).
 */
@Entity({ name: "integration_endpoint" })
@Index("uq_integration_endpoint_active", ["system", "event", "action"], {
  unique: true,
  where: `"active" = true`,
})
export class IntegrationEndpoint {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro


  /** Sistema de destino (e.g., 'erp', 'wms') */
  @Column({ name: "target_system", type: "varchar", length: 80 })
  system!: string;

  /** Evento (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  event!: string;

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

  // @Column({ name: "http_method", type: "varchar", length: 10, default: 'POST', nullable: true })
  // httpMethod!: HttpMethod | null;

  /**
   * Config HTTP específica (quando transport = 'http'):
   * {
   *   method: 'POST' | 'PUT' | 'PATCH' | 'GET' | 'DELETE',
   *   pathTemplate?: string,              // ex.: /v1/drivers/{{id}}
   *   headersTemplate?: Record<string, string>, // valores podem conter templates
   *   queryTemplate?: Record<string, any>,
   *   bodyTemplate?: any,                 // JSONata/Liquid/Handlebars
   *   contentType?: 'application/json' | 'application/xml' | 'text/plain' | string,
   *   timeoutMs?: number,
   *   compression?: { type?: 'gzip' | 'deflate' | 'br' }
   * }
   */
  @Column({ name: "http_config", type: "jsonb", nullable: true })
  httpConfig?: EndpointHttpConfig | null;

  /**
   * Config de fila/stream (quando transport = 'amqp' | 'kafka' | 'sqs' | 'pubsub'):
   * {
   *   topic?: string, queue?: string, exchange?: string, routingKey?: string,
   *   partitionKey?: string, messageKey?: string,
   *   headersTemplate?: Record<string, string>,
   *   properties?: Record<string, any>, // amqp/kafka props
   *   payloadTemplate?: any
   * }
   */
  @Column({ name: "queue_config", type: "jsonb", nullable: true })
  queueConfig?: EndpointQueueConfig| null;


  /**
   * Política de retentativa:
   * { maxAttempts: 3, strategy: 'exponential' | 'fixed', delayMs: 1000, maxDelayMs?: 60000, jitter?: true }
   */
  @Column({ name: "retry_policy", type: "jsonb", nullable: true })
  retryPolicy?: EndpointRetryPolicy | null;

  /**
   * Rate limiting por rota:
   * { limit: 100, intervalMs: 1000, burst?: 50, key?: 'targetSystem' | 'endpoint' | 'custom' }
   */
  @Column({ name: "rate_limit", type: "jsonb", nullable: true })
  rateLimit?: EndpointRateLimitConfig | null;

  /**
   * Política de circuit breaker opcional por endpoint.
   * { threshold?: number; openMs?: number; halfOpenMaxAttempts?: number }
   */
  @Column({ name: "breaker_policy", type: "jsonb", nullable: true })
  breakerPolicy?: EndpointBreakerPolicy | null;

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
/**
 */
// src/integration/entities/integration-outbound.entity.ts
// 
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { HttpMethod, TransportProtocol } from "./integration.enums.js";


/**
 * Definição de roteamento de saída por chave (evento) e destino.
 * Agora inclui também as configurações de Target/Delivery (protocolo, endpoint, templates, políticas, etc.).
 */
@Entity({ name: "integration_endpoint" })
@Index(["name", "active"], { unique: true })
@Index(["credentialId"])
export class IntegrationEndpoint {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** Sistema do endpoint (e.g., 'tms') */
  @Column({ type: "varchar", length: 80 })
  name!: string;

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

  @Column({ name: "http_method", type: "varchar", length: 10, default: 'POST' })
  httpMethod!: HttpMethod;

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
  httpConfig?: Record<string, any> | null;

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
  queueConfig?: Record<string, any> | null;


  /**
   * Referência a credenciais reutilizáveis (IntegrationCredential.id).
   */
  @Column({ name: "credential_id", type: "uuid", nullable: true })
  credentialId?: string | null;

  /**
   * Opções de TLS/MTLS, certificados, SNI etc.
   * Ex.: { rejectUnauthorized: true, ca?: string, cert?: string, key?: string, servername?: string }
   */
  @Column({ type: "jsonb", nullable: true })
  tls?: Record<string, any> | null;

  /**
   * Política de retentativa:
   * { maxAttempts: 3, strategy: 'exponential' | 'fixed', delayMs: 1000, maxDelayMs?: 60000, jitter?: true }
   */
  @Column({ name: "retry_policy", type: "jsonb", nullable: true })
  retryPolicy?: {
    maxAttempts?: number;
    strategy?: 'exponential' | 'fixed';
    delayMs?: number;
    maxDelayMs?: number;
    jitter?: boolean;
  } | null;

  /**
   * Rate limiting por rota:
   * { limit: 100, intervalMs: 1000, burst?: 50, key?: 'targetSystem' | 'endpoint' | 'custom' }
   */
  @Column({ name: "rate_limit", type: "jsonb", nullable: true })
  rateLimit?: {
    limit?: number;
    intervalMs?: number;
    burst?: number;
  } | null;

  /**
   * Idempotência:
   * { strategy: 'header' | 'bodyHash' | 'custom', headerName?: 'Idempotency-Key', ttlMs?: 300000 }
   */
  @Column({ type: "jsonb", nullable: true })
  idempotency?: Record<string, any> | null;

  @CreateDateColumn({ name: "create_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "update_at", type: "timestamptz" })
  updatedAt!: Date;

}
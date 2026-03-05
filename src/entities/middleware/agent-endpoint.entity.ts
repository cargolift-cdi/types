/**
 * @fileoverview Entidade MiddlewareAgentEndpoint — configuração de endpoints de integração outbound.
 *
 * Cada registro define o destino, o método HTTP, a autenticação e as políticas de resiliência
 * (retry, rate-limit, circuit breaker, concorrência) para uma combinação (agent, entity, action).
 *
 * A combinação (agent, entity, action, version) é única quando `active = true`.
 *
 * @author Israel A. Possoli
 * @date 2026-01-06
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { HttpMethod, TransportProtocol } from "../../enum/integration.enums.js";
import { EndpointTlsConfig, GraphqlEndpointConfig, HttpHeader, ResiliencePolicy, ResponseInterpreterRules } from "../../interfaces/integration.interface.js";


@Entity({ name: "agent_endpoint" })
@Index("uq_agent_endpoint_active", ["agent", "entity", "action", "version"], {
  unique: true,
  where: `"active" = true`,
})
export class MiddlewareAgentEndpoint {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Agente de destino (ex.: 'erp', 'wms') */
  @Column({ type: "varchar", length: 40 })
  agent!: string;

  /** Entidade integrada (ex.: 'invoice', 'driver') */
  @Column({ type: "varchar", length: 40 })
  entity!: string;

  /** Ação (ex.: 'create', 'update', 'delete', 'all', 'upsert') */
  @Column({ type: "varchar", length: 40 })
  action!: string;

  @Column({ type: "int", default: 1 })
  version!: number;

  @Column({ type: "boolean", default: true })
  active!: boolean;

  // ─── Transporte ─────────────────────────────────────────────────

  /** Protocolo de saída: 'REST' | 'SOAP' | 'GRAPHQL' | 'AMQP' */
  @Column({ name: "transport_protocol", type: "varchar", length: 20 })
  transportProtocol!: TransportProtocol;

  /** URL base do destino (ex.: https://api.example.com) */
  @Column({ name: "base_url", type: "varchar", length: 500 })
  baseUrl!: string;

  // ─── HTTP ───────────────────────────────────────────────────────

  /** Método HTTP (ex.: POST, PUT, GET) */
  @Column({ name: "http_method", type: "varchar", length: 10 })
  method!: HttpMethod;

  /** Caminho relativo à baseUrl (ex.: /v1/invoices) */
  @Column({ type: "varchar", length: 500, nullable: true })
  path?: string | null;

  /** Content-Type padrão para o body (default: application/json) */
  @Column({ name: "content_type", type: "varchar", length: 100, nullable: true })
  contentType?: string | null;

  /** Headers customizados (ex.: { "X-Tenant-Id": "cargolift" }) */
  @Column({ type: "jsonb", nullable: true })
  headers?: HttpHeader | null;

  /** Query parameters fixos (ex.: { "format": "full" }) */
  @Column({ name: "query_params", type: "jsonb", nullable: true })
  queryParams?: Record<string, string> | null;

  /** Regras de interpretação da resposta (para validar sucesso/falha configurável) */
  @Column({ name: "response_rules", type: "jsonb", nullable: true })
  responseRules?: ResponseInterpreterRules | null;

  /** Status HTTP que devem ser tratados como retryable (ex.: [500, 502, 503, 504]) */
  @Column({ name: "retryable_status_codes", type: "jsonb", nullable: true })
  retryableStatusCodes?: number[] | null;

  /** Timeout da requisição HTTP em milissegundos (default no engine: 15000) */
  @Column({ name: "timeout_ms", type: "int", nullable: true })
  timeoutMs?: number | null;

  // ─── Autenticação ───────────────────────────────────────────────

  /** Referência a credenciais reutilizáveis (agent_credential.id) */
  @Column({ name: "credential_id", type: "bigint", nullable: true })
  credentialId?: string | null;

  // ─── TLS ────────────────────────────────────────────────────────

  /** Opções de TLS/mTLS (certificados, SNI, etc.) */
  @Column({ type: "jsonb", nullable: true })
  tls?: EndpointTlsConfig | null;

  // ─── Resiliência ────────────────────────────────────────────────

  /**
   * Políticas de resiliência agrupadas:
   * { retry?: RetryPolicy, rateLimit?: RateLimit, breaker?: BreakerPolicy, maxConcurrent?: number }
   */
  @Column({ type: "jsonb", nullable: true })
  resilience?: ResiliencePolicy | null;

  // ─── GraphQL ────────────────────────────────────────────────────

  /**
   * Configuração específica para endpoints GraphQL:
   * { query, operationName?, defaultVariables?, variablesMapping? }
   * Usado apenas quando transportProtocol = 'GRAPHQL'.
   */
  @Column({ name: "graphql_config", type: "jsonb", nullable: true })
  graphqlConfig?: GraphqlEndpointConfig | null;

  // ─── Metadados ──────────────────────────────────────────────────

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { WebhookRetryPolicy } from "../../interfaces/tracking.interface.js";

/**
 * Configuração de inscrição de webhook para um agente de integração.
 *
 * Permite que sistemas parceiros se inscrevam para receber notificações
 * em tempo real sobre eventos específicos (ex: driver.created, trip.updated).
 *
 * Quando o pipeline de integração conclui (sucesso ou falha), o sistema
 * verifica as subscriptions ativas que correspondem ao evento e dispara
 * um POST para a URL configurada, assinado com HMAC-SHA256.
 *
 * Padrões de evento suportados:
 * - Exato: "driver.created"
 * - Wildcard por entidade: "driver.*"
 * - Wildcard global: "*"
 */
@Entity({ name: "webhook_subscription" })
@Index(["id"], { unique: true })
@Index(["agentId", "event", "isActive"])
@Index(["event", "isActive"])
export class WebhookSubscription {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /**
   * ID do agente de integração inscrito (FK lógica → integration_agent.id).
   * Identifica qual sistema parceiro receberá as notificações.
   */
  @Column({ name: "agent_id", type: "bigint" })
  agentId!: string;

  /**
   * Nome/slug do agente (desnormalizado para consultas rápidas).
   * Ex: 'erp', 'wms', 'tms'
   */
  @Column({ name: "agent_name", type: "varchar", length: 80 })
  agentName!: string;

  /**
   * Padrão do evento para matching.
   * Formato: "entity.action" | "entity.*" | "*"
   * Exemplos: "driver.created", "driver.*", "trip.updated", "*"
   */
  @Column({ type: "varchar", length: 120 })
  event!: string;

  /** URL de callback para onde o POST será enviado */
  @Column({ name: "target_url", type: "varchar", length: 500 })
  targetUrl!: string;

  /**
   * Secret para assinatura HMAC-SHA256 do payload.
   * O header `X-Webhook-Signature` será enviado com a assinatura
   * para que o receptor possa validar a autenticidade da notificação.
   */
  @Column({ type: "varchar", length: 255 })
  secret!: string;

  /** Indica se a subscription está ativa */
  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  /**
   * Política de retry para entrega do webhook.
   * Padrão: { maxRetries: 3, backoffMs: [1000, 5000, 30000] }
   */
  @Column({ name: "retry_policy", type: "jsonb", nullable: true, default: () => "'{\"maxRetries\": 3, \"backoffMs\": [1000, 5000, 30000]}'" })
  retryPolicy?: WebhookRetryPolicy | null;

  /**
   * Headers customizados a serem enviados junto com a notificação.
   * Ex: { "X-Custom-Header": "value" }
   */
  @Column({ type: "jsonb", nullable: true })
  headers?: Record<string, string> | null;

  /** Descrição livre para documentação/identificação */
  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}

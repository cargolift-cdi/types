import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";


/**
 * Mantém o histórico de chamadas de integração de entrada (inbound).
 * Armazena o request e response para auditoria e troubleshooting.
 */
@Entity({ name: "log_integration_inbound" })
@Index(["system", "event", "action", "date"])
@Index("idx_log_integration_inbound_correlation_id", ["correlationId"])
export class LogIntegrationInbound {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Correlation Id */
  @Column({ name: "correlation_id", type: "varchar", length: 100 })
  correlationId!: string;

  /** Sistema de destino (e.g., 'erp', 'wms') */
  @Column({ name: "system", type: "varchar", length: 80 })
  system!: string;

  /** Evento (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  event!: string;

  /** Ação (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  action!: string;

  @Column({ type: "date" })
  date!: Date;

  /** Status Code */
  @Column({ name: "status_code", type: "int" })
  statusCode!: number;

  /** Payload de requisição recebido */
  @Column({ name: "request_payload", type: "jsonb" })
  requestPayload!: Record<string, any>;

  /** Payload de resposta enviada */
  @Column({ name: "response_payload", type: "jsonb", nullable: true })
  responsePayload?: Record<string, any> | null;
}
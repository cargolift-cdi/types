/**
 * Entidade para log de auditoria de alterações de dados mestres (MDM).
 * Armazena o histórico de operações realizadas em dados mestres, incluindo payloads, status e erros.
 */
import { IntegrationActions } from "src/interfaces/integration.interface";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export interface MdmAuditTrailFields {
  field: string;
  oldValue?: string;
  newValue?: string;
}

/**
 * Mantém o histórico de chamadas de integração de entrada (inbound).
 * Armazena o request e response para auditoria e troubleshooting.
 */
@Entity({ name: "audit_trail" })
@Index(["id"], { unique: true })
@Index(["correlationId"], { unique: true })
@Index(["entity", "recordId"], { where: "record_id IS NOT NULL" })
@Index(["changedAt"])
export class MdmAuditTrail {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Entidade (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  entity!: string;

  @Column({ name: "record_id", type: "varchar", length: 100, nullable: true })
  recordId?: string | undefined; // ID do registro afetado (opcional, pode ser preenchido posteriormente para facilitar buscas)

  /** Operação CRUD  (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  operation!: "create" | "update" | "delete";

  /** Correlation Id do início da operação*/
  @Column({ name: "correlation_id", type: "varchar", length: 36 })
  correlationId!: string;

  /** Alterações */
  @Column({ type: "jsonb", nullable: true })
  changes?: MdmAuditTrailFields[] | null;

  /** Agente (sistema) que efetuou a alteração */
  @Column({ type: "varchar", length: 100, nullable: true })
  agent?: string | null;

  /** Usuário que efetuou a alteração */
  @Column({ type: "varchar", length: 100, nullable: true })
  user?: string | null;

  /**Informações adicionais */
  @Column({ type: "jsonb", nullable: true })
  additionalInfo?: Record<string, any> | null;

  /** Timestamp da alteração */
  @Column({ name: "changed_at", type: "timestamptz" })
  changedAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}

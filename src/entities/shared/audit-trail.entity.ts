/**
 * Entidade para log de auditoria de alterações de dados mestres (MDM).
 * Armazena o histórico de operações realizadas em dados mestres, incluindo payloads, status e erros.
 */
import { DiffChangeLog } from "../../interfaces/audit-trail.interface";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * Mantém o histórico de chamadas de integração de entrada (inbound).
 * Armazena o request e response para auditoria e troubleshooting.
 */
@Entity({ name: "audit_trail" })
@Index(["id"], { unique: true })
@Index(["correlationId"], { unique: true })
@Index(["entity", "recordId"], { where: "record_id IS NOT NULL" })
@Index(["changedAt"])
export class AuditTrail {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Entidade (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  entity!: string;

  @Column({ name: "record_id", type: "varchar", length: 100, nullable: true })
  recordId?: string | undefined; // ID do registro afetado (opcional, pode ser preenchido posteriormente para facilitar buscas)
  
  /** Business Key (chave de negócio) */
  @Column({ name: "business_key", type: "jsonb", nullable: true })
  businessKey?: Record<string, any> | null;

  /** Operação CRUD  (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  operation!: "create" | "update" | "delete";

  /** Correlation Id do início da operação*/
  @Column({ name: "correlation_id", type: "varchar", length: 36 })
  correlationId!: string;

  /** Alterações */
  @Column({ type: "jsonb", nullable: true })
  changes?: DiffChangeLog[] | null;

  /** Agente (sistema) que efetuou a alteração */
  @Column({ type: "varchar", length: 100, nullable: true })
  agent?: string | null;

  /** Usuário que efetuou a alteração */
  @Column({ type: "varchar", length: 100, nullable: true })
  username?: string | null;

  /**Informações adicionais */
  @Column({ name: "additional_info", type: "jsonb", nullable: true })
  additionalInfo?: Record<string, any> | null;

  /** Timestamp da alteração */
  @Column({ name: "changed_at", type: "timestamptz" })
  changedAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}

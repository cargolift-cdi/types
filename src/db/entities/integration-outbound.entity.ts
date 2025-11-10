import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Outbound routing definition per source key. One row per target (e.g., WMS, TMS).
 */
@Entity({ name: "integration_outbound" })
@Index(["system", "event", "targetSystem", "version"], { unique: true })
export class IntegrationOutbound {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** Sistema de origem (e.g., 'tms') */
  @Column({ type: "varchar", length: 80 })
  system!: string;

  /** Sistema de destino (e.g., 'erp', 'wms') */
  @Column({ type: "varchar", length: 80 })
  targetSystem!: string;

  /** Evento (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  event!: string;

  /** Versão da rota. Apenas a última versão pode estar ativa. Versões anteriores não podem sofrer modificações */
  @Column({ type: "int", default: 1 })
  version!: number;

  /** Descrição */
  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string | null;

  /** Regras (BRE RulesConfiguration) */
  @Column({ type: "jsonb" })
  rules!: Record<string, any>;

  /** Se a rota está ativa */
  @Column({ type: "boolean", default: true })
  active!: boolean;

  /** Opções adicionais de roteamento (reservado para uso futuro) */
  @Column({ type: "jsonb", nullable: true })
  options?: Record<string, any> | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}

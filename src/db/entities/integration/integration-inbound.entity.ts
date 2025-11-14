import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";


/**
 * Eventos de integração (tms.driver) - Ocorre na integração de entrada (inbound) antes do roteamento.
 * Define expressões JSONata para transformar mensagens de eventos externos em formato JSON canônico interno.
 * Também armazena configurações de regras global (BRE) associadas ao evento.
 */
@Entity({ name: "integration_inbound" })
@Index(["system", "event", "version"], { unique: true })
export class IntegrationInbound {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  /** Sistema de origem (e.g., 'erp') */
  @Column({ type: "varchar", length: 80 })
  system!: string;

  /** Evento (e.g., 'driver') */
  @Column({ type: "varchar", length: 80 })
  event!: string;

  /** Versão da rota. Apenas a última versão pode estar ativa. Versões anteriores não podem sofrer modificações */
  @Column({ type: "int", default: 1 })
  version!: number;  

  /** Descrição opcional amigável ao usuário */
  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string | null;

  /** Pré-validação do payload de origem  */
  @Column({ type: "jsonb", nullable: true })
  validation!: Record<string, any>;

  /** Expressão JSONata  */
  @Column({ type: "text", nullable: true })
  transformation!: string;

  /** Regra global (BRE RulesConfiguration) */
  @Column({ type: 'jsonb', nullable: true })
  rules!: Record<string, any>;

  /**Se a rota está ativa */
  @Column({ type: "boolean", default: true })
  active!: boolean;

  /** Opções adicionais (reservado para uso futuro) */
  @Column({ type: "jsonb", nullable: true })
  options?: Record<string, any> | null;

  @CreateDateColumn({ name: "create_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "update_at", type: "timestamptz" })
  updatedAt!: Date;

}

/**
 * @fileoverview Entidade IntegrationOutbound - Define configurações de integração de saída (outbound)
 * @author Israel A. Possoli
 * @date 2026-01-06 * 
 * 
 * Representa a definição de roteamento outbound para integração entre sistemas. 
 * Cada registro define uma rota de saída para uuma entidade específico, incluindo o agente de destino, versão e regras associadas.
 *
 * Esta entidade mapeia uma rota de saída por chave de origem e destino, armazenando
 * regras e metadados necessários para encaminhar entidades (por exemplo, do TMS para o WMS).
 * Cada registro corresponde a um alvo (targetAgent) para uuma entidade específico e versão.
 *
 * @remarks
 * - Há um índice único composto por (agent, entity, action, targetAgent, version) garantindo que
 *   não existam duplicatas de rota para a mesma combinação.
 * - Somente a versão mais recente de uma rota pode estar ativa; versões anteriores devem ser imutáveis.
 */

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";



@Entity({ name: "integration_outbound" })
@Index(["agent", "entity", "action", "targetAgent", "version"], { unique: true })
@Index("uq_integration_outbound_active", ["agent", "entity", "action", "targetAgent"], {
  unique: true,
  where: `"active" = true`,
})
export class IntegrationOutbound {
  /** Identificador único do agente de integração */
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Agente de origem (e.g., 'tms') */
  @Column({ type: "varchar", length: 80 })
  agent!: string;

  /** Evento (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  entity!: string;

  /** Ação (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  action!: string;  

  /** Agente de destino (e.g., 'erp', 'wms') */
  @Column({ name: "target_agent", type: "varchar", length: 80 })
  targetAgent!: string;


  /** Versão da rota. Apenas a última versão pode estar ativa. Versões anteriores não podem sofrer modificações */
  @Column({ type: "int", default: 1 })
  version!: number;

  /** Se a rota está ativa */
  @Column({ type: "boolean", default: true })
  active!: boolean;


  /** Descrição */
  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string | null;

  /** Regras (BRE RulesConfiguration) */
  @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
  rules?: Record<string, any>;

  /** Opções adicionais (reservado para uso futuro) */
  // @Column({ type: "jsonb", nullable: true })
  // options?: Record<string, any> | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
  

}
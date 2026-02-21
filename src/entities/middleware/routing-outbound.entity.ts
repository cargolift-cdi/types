/**
 * @fileoverview Entidade RoutingOutbound - Define configurações de integração de saída (outbound)
 * @author Israel A. Possoli
 * @date 2026-01-06 * 
 * 
 * Representa a definição de roteamento outbound para integração entre agentes. 
 * Cada registro define uma rota de saída para uma agente e entidade específica , versão e regras associadas.
 *
 * Esta entidade mapeia uma rota de saída por chave de origem e destino, armazenando
 * regras e metadados necessários para encaminhar entidades (por exemplo, do TMS para o WMS).
 * Cada registro corresponde a um alvo (agent) para uma agente específica e versão.
 *
 * @remarks
 * - Há um índice único composto por (agent, entity, action, version) garantindo que
 *   não existam duplicatas de rota para a mesma combinação.
 * - Somente a versão mais recente de uma rota pode estar ativa; versões anteriores devem ser imutáveis.
 */

import { PayloadConditionsValue } from "../../interfaces/payload-condition.interface";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";



@Entity({ name: "routing_outbound" })
@Index(["agent", "entity", "action", "version"], { unique: true })
@Index("uq_routing_outbound_active", ["agent", "entity", "action"], {
  unique: true,
  where: `"active" = true`,
})
export class RoutingOutbound {
  /** Identificador único do agente de integração */
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Agente de origem (e.g., 'tms') */
  @Column({ type: "varchar", length: 80 })
  agent!: string;

  /** Entidade (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  entity!: string;

  /** Ação (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  action!: string;  

  /** Versão da rota. Apenas a última versão pode estar ativa. Versões anteriores não podem sofrer modificações */
  @Column({ type: "int", default: 1 })
  version!: number;

  /** Se a rota está ativa */
  @Column({ type: "boolean", default: true })
  active!: boolean;

  /** Descrição */
  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string | null;

  /** Condições para ativação da rota */
  @Column({ type: "jsonb", default: () => "'{}'::jsonb", nullable: true })
  conditions?: PayloadConditionsValue | null;

  /** Regras (BRE RulesConfiguration) */
  @Column({ type: "jsonb", default: () => "'{}'::jsonb", nullable: true })
  rules?: Record<string, any>;

  /** Expressão JSONata para transformação do payload de entrada para o formato canônico */
  @Column({ type: "text", nullable: true })
  transformation?: string | null;  

  /** Dependência de outras rotas para o mesmo agent e entidade */
  @Column({ type: "jsonb", default: () => "'{}'::jsonb", nullable: true })
  dependencies?: Record<string, any> | null;

  /** Opções adicionais (reservado para uso futuro) */
  // @Column({ type: "jsonb", nullable: true })
  // options?: Record<string, any> | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
  

}
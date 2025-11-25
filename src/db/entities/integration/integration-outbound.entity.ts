/**
 * Representa a definição de roteamento outbound para eventos originados por um sistema.
 *
 * Esta entidade mapeia uma rota de saída por chave de origem e destino, armazenando
 * regras e metadados necessários para encaminhar eventos (por exemplo, do TMS para o WMS).
 * Cada registro corresponde a um alvo (targetSystem) para um evento específico e versão.
 *
 * @remarks
 * - Há um índice único composto por (system, event, targetSystem, version) garantindo que
 *   não existam duplicatas de rota para a mesma combinação.
 * - Somente a versão mais recente de uma rota pode estar ativa; versões anteriores devem ser imutáveis.
 *
 * @property id UUID gerada automaticamente que identifica unicamente a rota.
 * @property system Sistema de origem (ex.: "tms"), usado para agrupar/filtrar rotas por emissor.
 * @property targetSystem Sistema de destino (ex.: "erp", "wms") para o qual o evento será encaminhado.
 * @property event Chave do evento (ex.: "driver", "driver.created") que aciona esta rota.
 * @property version Versão da rota. Versões anteriores não devem ser modificadas; apenas a última pode estar ativa.
 * @property description Texto descritivo opcional da rota (até 500 caracteres).
 * @property rules Configuração de regras (BRE) em formato JSONB utilizada para avaliar/executar o roteamento.
 * @property active Indicador se a rota está ativa e deve ser considerada pelo mecanismo de envio.
 * @property options Campo JSONB opcional para opções adicionais de roteamento (reservado para uso futuro).
 * @property createdAt Timestamp (timestamptz) de criação do registro.
 * @property updatedAt Timestamp (timestamptz) da última atualização do registro.
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


/**
 * Definição de roteamento de saída por chave (evento) e destino.
 * Agora inclui também as configurações de Target/Delivery (protocolo, endpoint, templates, políticas, etc.).
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
  @Column({ name: "target_system", type: "varchar", length: 80 })
  targetSystem!: string;

  /** Evento (chave) (e.g., 'driver' or 'driver.created') */
  @Column({ type: "varchar", length: 80 })
  event!: string;

    /** Ação (e.g., 'create', 'update', 'delete', etc */
  @Column({ type: "varchar", length: 40 })
  action!: string;  

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

  /** Opções adicionais (reservado para uso futuro) */
  @Column({ type: "jsonb", nullable: true })
  options?: Record<string, any> | null;

  @CreateDateColumn({ name: "create_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "update_at", type: "timestamptz" })
  updatedAt!: Date;

}
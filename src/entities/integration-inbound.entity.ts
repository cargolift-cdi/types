/**
 * @fileoverview Entidade IntegrationInbound - Define configurações de integração de entrada (inbound)
 * @author Israel A. Possoli
 * @date 2026-01-06 
 * Representa uma rota de integração de entrada (inbound) que descreve como eventos externos
 * devem ser validados, transformados e aplicados às regras globais antes do roteamento interno.
 *
 * @remarks
 * - Cada combinação (system, event, action, version) é única.
 * - Apenas uma versão por (system, event, action) pode estar ativa ao mesmo tempo.
 * - Versões anteriores devem ser imutáveis após a publicação de novas versões.
 * - Transformações usam expressões JSONata para mapear payloads externos ao formato canônico interno.
 *

 */
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IntegrationInboundRouting } from "../interfaces/integration.interface.js";

/**
 * Eventos de integração (tms.driver) - Ocorre na integração de entrada (inbound) antes do roteamento.
 * Define expressões JSONata para transformar mensagens de eventos externos em formato JSON canônico interno.
 * Também armazena configurações de regras global (BRE) associadas ao evento.
 */
@Entity({ name: "integration_inbound" })
@Index(["system", "event", "action", "version"], { unique: true })
@Index("uq_integration_inbound_active", ["system", "event", "action"], {
  unique: true,
  where: `"active" = true`,
})
export class IntegrationInbound {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Sistema de origem (e.g., 'erp') */
  @Column({ type: "varchar", length: 80 })
  system!: string;

  /** Evento (e.g., 'driver') */
  @Column({ type: "varchar", length: 80 })
  event!: string;

  /** Ação (e.g., 'create', 'update', 'delete', etc */
  @Column({ type: "varchar", length: 40 })
  action!: string;

  /** Modo de roteamento que sobrescreve o modo definido no evento (integration_event) 
   * - 'direct': Roteia diretamente para sistemas de destino sem passar pelo ODS
   * - 'ods': Roteia para o ODS (Operational Data Store) antes de enviar para sistemas de destino
   * - 'mdos': Roteia para fila de dados mestres (MDOS) antes de enviar para sistemas de destino
   * - 'default': Usa o modo definido no evento (integration_event)
  */
  @Column({ type: "varchar", length: 20, nullable: true })
  overrideRoutingMode?: "default" | "direct" | "ods" | "mdos" | null;

  /** Condições de roteamento de ações (action) baseadas no payload de canônico
   * Direciona a integração para diferentes eventos de outbound (saída). Ex: 'driver' para 'people'
   */
  @Column({ type: "jsonb", nullable: true })
  routingOutboundEvent?: IntegrationInboundRouting[];

  /** Condições de definição para ações (action) baseadas no payload canônico
   * Direciona a integração para diferentes ações de outbound (saída). Ex: 'POST' para 'CREATE', 'PUT' para 'UPDATE'
   */
  @Column({ type: "jsonb", nullable: true })
  routingOutboundAction?: IntegrationInboundRouting[];

  /** Versão da rota. Apenas a última versão pode estar ativa. Versões anteriores não podem sofrer modificações */
  @Column({ type: "int", default: 1 })
  version!: number;

  /**Se a rota está ativa */
  @Column({ type: "boolean", default: true })
  active!: boolean;

  /** Descrição opcional amigável ao usuário */
  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string | null;

  /** Pré-validação do payload de origem, antes da transformação para o formato canônico */
  @Column({ type: "jsonb", nullable: true })
  validation?: Record<string, any> | null;

  /** Expressão JSONata para transformação do payload de entrada para o formato canônico */
  @Column({ type: "text", nullable: true })
  transformation?: string | null;

  /** Regra global (BRE RulesConfiguration) aplicada após a transformação do payload canônico */
  @Column({ type: "jsonb", nullable: true })
  rules?: Record<string, any> | null;

  // Expressão JSONNata para extração da referência externa (código do cadastro, número do documento, etc) a partir do payload canônico (transformado)
  @Column({ type: "text", nullable: true })
  refExtraction?: string | null;

  // Nome do tipo de referência externa (e.g., 'cte', 'cnpj', 'viagem', etc)
  @Column({ type: "varchar", nullable: true })
  refType?: string | null;

  // Expressão JSONNata para extração de referências adicionais (e.g., múltiplos códigos relacionados em formato Json) a partir do payload canônico (transformado)
  @Column({ type: "text", nullable: true })
  additionalRefsExtraction?: string | null;

  /** Opções adicionais (reservado para uso futuro) */
  // @Column({ type: "jsonb", nullable: true })
  // options?: Record<string, any> | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}

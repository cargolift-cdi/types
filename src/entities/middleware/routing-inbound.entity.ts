/**
 * @fileoverview Entidade RoutingInbound - Define configurações de integração de entrada (inbound)
 * @author Israel A. Possoli
 * @date 2026-01-06 
 * Representa uma rota de integração de entrada (inbound) que descreve como entidades externas (o que está sendo integrado)
 * devem ser validados, transformados e aplicados às regras globais antes do roteamento dentro do ESB para o MDM, ODS ou agentes de destino.
 *
 * @remarks
 * - Cada combinação (agent, endpoint, method, version) é única.
 * - Apenas uma versão por (agent, endpoint, method) pode estar ativa ao mesmo tempo.
 * - Versões anteriores devem ser imutáveis após a publicação de novas versões.
 * - Transformações usam expressões JSONata para mapear payloads externos ao formato canônico interno.
 *

 */
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IntegrationActions, IntegrationInboundRouting } from "../../interfaces/integration.interface.js";
import { SchemaValidation } from "../../interfaces/schema-validation.interface.js";

/**
 * Perfil de rotas de integração de entrada (inbound) para validação, transformação e roteamento.
 * Utilize agent + endpoint + method no IntegrationEntity para referenciar estas rotas.
 */
@Entity({ name: "routing_inbound" })
@Index(["agent", "endpoint", "method", "version"], { unique: true })
@Index("uq_routing_inbound_active", ["agent", "endpoint", "method"], {
  unique: true,
  where: `"active" = true`,
})
export class RoutingInbound {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Agente de integração de origem (e.g., 'erp') */
  @Column({ type: "varchar", length: 80 })
  agent!: string;

  /** Endpoint  (e.g., 'driver', 'cte', etc) */
  @Column({ type: "varchar", length: 80 })
  endpoint!: string;

  /** Método HTTP (e.g., 'GET', 'POST', 'PUT', 'DELETE', etc), será usado para identificar qual a ação que será executada
   * Pode ser usado para diferenciar ações em um mesmo endpoint de integração. Ex: 'POST' para 'CREATE', 'PUT' para 'UPDATE', etc.
   * Também pode ser usado para roteamento condicional baseado no método HTTP, caso um mesma entidade de integração receba chamadas com métodos diferentes.
   * Exemplo: um endpoint de integração que recebe tanto 'POST' para criar um cadastro quanto 'PUT' para atualizar o cadastro, ambos mapeados para a mesma entidade 'driver' mas com ações diferentes ('create' e 'update', por exemplo).
   * Pode-se usar vários métodos para a mesma ação, caso queira mapear 'POST' e 'PUT' para a ação 'upsert', por exemplo. Neste caso, o campo method pode conter uma lista de métodos HTTP (ex: "POST, PUT") e a lógica de roteamento deve considerar isso.
   */
  @Column({ type: "varchar", length: 80 })
  method!: string;

  /** Entidade padrão associada ao endpoint (e.g., 'trip.close' para entidade 'trip.update') */
  @Column({ type: "varchar", length: 80 })
  entity!: string;    

  /** Ação dentro do middleware (e.g., 'create', 'update', 'delete', etc) */
  @Column({ type: "varchar", length: 40 })
  action!: IntegrationActions;

  /** Versão da rota. Apenas a última versão pode estar ativa. Versões anteriores não podem sofrer modificações */
  @Column({ type: "int", default: 1 })
  version!: number;

  /**Se a rota está ativa */
  @Column({ type: "boolean", default: true })
  active!: boolean;

  /** Descrição opcional amigável ao usuário */
  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string | null;

  /** Condições de definição para entidades (entity) baseadas no payload canônico (transformado).
   * É aplicado dentro do ESB
   * Sobrepõe a entidade definida no campo 'entity' para roteamento condicional baseado no conteúdo do payload. 
   * Ex: Uma integração de pessoa física (people) quando no payload tiver um campo "type" com valor "driver", então a entidade será 'driver' ao invés de 'people'
   * Útil para casos onde o mesmo endpoint de integração recebe chamadas com a mesma combinação de método HTTP e entidade, mas a entidade a ser processada depende do conteúdo do payload.
   */
  @Column({ name: "routing_entity", type: "jsonb", nullable: true })
  routingEntity?: IntegrationInboundRouting[];

  /** Condições de definição para ações (action) baseadas no payload canônico (transformado).
   * É aplicado dentro do ESB
   * Sobrepõe a ação definida no campo 'action' para roteamento condicional baseado no conteúdo do payload. 
   * Ex: Se o payload tiver um campo "operation" com valor "update", então a ação será 'update' ao invés de 'create', mesmo que o método HTTP seja 'POST'.
   * Útil para casos onde o mesmo endpoint de integração recebe chamadas com a mesma combinação de método HTTP e entidade, mas a ação a ser executada depende do conteúdo do payload.
   */
  @Column({ name: "routing_action",type: "jsonb", nullable: true })
  routingAction?: IntegrationInboundRouting[];

  
  /** Pré-validação do payload do agente de integração (antes da transformação para o formato canônico) */
  @Column({ type: "jsonb", nullable: true })
  validation?: SchemaValidation | null;
  
  /** Expressão JSONata para transformação do payload de entrada para o formato canônico */
  @Column({ type: "text", nullable: true })
  transformation?: string | null;
  
  /** Regra global (BRE RulesConfiguration) aplicada após a transformação do payload canônico */
  @Column({ type: "jsonb", nullable: true })
  rules?: Record<string, any> | null;

 
  // Expressão JSONNata para extração de referências a partir do payload original (antes da transformação para o formato canônico)
  // Será armazenadas no campo 'external_reference' do log_routing_inbound para facilitar buscas, correlações e auditorias.
  @Column({ name: "external_reference_extraction", type: "text", nullable: true })
  externalReferenceExtraction?: string | null;
  
  /** Modo de roteamento que sobrescreve o modo definido na entidade (integration_entity)
   * - 'direct': Roteia diretamente para os agentes de destino sem passar pelo ODS
   * - 'ods': Roteia para o ODS (Operational Data Store) antes de enviar para os agentes de destino
   * - 'mdm': Roteia para fila de dados mestres (MDM) antes de enviar para os agentes de destino
   * - 'default': Usa o modo definido na entidade (integration_entity)
   */
  @Column({ name: "override_routing_mode", type: "varchar", length: 20, nullable: true })
  overrideRoutingMode?: "default" | "direct" | "ods" | "mdm" | null;


  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}

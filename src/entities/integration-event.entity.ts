/**
 * @fileoverview Entidade IntegrationEvent - Define eventos de integração e modos de roteamento.
 * @author Israel A. Possoli
 * @date 2026-01-19
 * 
 * @remarks
 * - Cada combinação (event, version) é única.
 * - Apenas uma versão por (event) pode estar ativa ao mesmo tempo.
 * - Versões anteriores devem ser imutáveis após a publicação de novas versões.
 * - O modo de roteamento define como o evento será processado dentro do middleware (direto, via ODS ou via MDM).
 */
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({ name: "integration_event" })
@Index(["event", "version"], { unique: true })
@Index("uq_integration_event_active", ["event"], {
  unique: true,
  where: `"active" = true`,
})
export class IntegrationEvent {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Evento (e.g., 'driver') */
  @Column({ type: "varchar", length: 80 })
  event!: string;

  /** Versão do evento. Apenas a última versão pode estar ativa. Versões anteriores não podem sofrer modificações */
  @Column({ type: "int", default: 1 })
  version!: number;

  /**Se a evento está ativa */
  @Column({ type: "boolean", default: true })
  active!: boolean;

  /** Descrição opcional amigável ao usuário */
  @Column({ type: "varchar", length: 500, nullable: true })
  description?: string | null;

  /**
   * Modo de roteamento do evento
   * - 'direct': Roteia diretamente para sistemas de destino sem passar pelo ODS
   * - 'ods': Roteia para o ODS (Operational Data Store) antes de enviar para sistemas de destino
   * - 'mdm': Roteia para fila de dados mestres (MDM) antes de enviar para sistemas de destino
   */
  @Column({ type: "varchar", length: 20, default: "ods" })
  routingMode!: "direct" | "ods" | "mdm";

  /** Opções adicionais (reservado para uso futuro) */
  // @Column({ type: "jsonb", nullable: true })
  // options?: Record<string, any> | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}

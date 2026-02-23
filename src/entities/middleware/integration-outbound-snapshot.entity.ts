/**
 * @fileoverview Entidade MdmOutBoundSnapshot
 * Define a estrutura da tabela mdm_outbound_snapshot para armazenar os snapshots das mensagens de integração de saída (outbound) processadas pelo MDM
 * 
 * @remarks
 *  - Inclui o payload e o hash do payload para rastreabilidade e auditoria, além de informações de roteamento e timestamps
 *  - O hash do payload é calculado utilizando SHA-256 e é usado para envio de mensagens idempotentes para sistemas de destino, evitando o processamento duplicado de mensagens com o mesmo conteúdo
 *  - A combinação de sentAt e status é usado para evitar que mensagens atrasadas sejam processadas fora de ordem, garantindo que apenas a mensagem mais recente para uma determinada entidade e ação seja considerada válida para processamento
 *  - O campo status é atualizado para 'pending' quando a mensagem é criada, e é atualizado para 'success' ou 'failed' após a tentativa de envio para o sistema de destino, permitindo monitoramento e reprocessamento de mensagens com falha
 * 
 * @author Israel A. Possoli
 * @date 2026-02-23
 */
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { IntegrationActions } from "../../interfaces/integration.interface";

@Entity({ name: "integration_outbound_snapshot" })
@Index(["id"], { unique: true })
@Index(["agent", "entity", "action"])
@Index(["agent", "entity", "action", "sentAt"])
@Index(["correlationId"])
@Index(["createdAt"])
export class IntegrationOutboundSnapshot {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string;

  @Column({ type: "varchar", length: 80 })
  agent!: string;

  @Column({ type: "varchar", length: 80 })
  entity!: string;

  @Column({ type: "varchar", length: 40 })
  action!: IntegrationActions;

  /** Correlation Id */
  @Column({ name: "correlation_id", type: "varchar", length: 36 })
  correlationId!: string;

  /** Business Key */
  @Column({ name: "business_key", type: "jsonb", nullable: true })
  businessKey?: Record<string, any> | null;  

  @Column({ name: "payload_hash" })
  payloadHash!: string;

  @Column({ type: "jsonb" })
  payload!: Record<string, unknown>;

  // Data de envio da integração de saída (outbound)
  @Column({ name: "sent_at", type: "timestamptz" })
  sentAt!: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}

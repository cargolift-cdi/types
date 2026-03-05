/**
 * @fileoverview Entidade Driver para MDM, representando um motorista com seus dados pessoais e de habilitação.
 * Esta entidade é utilizada para armazenar e gerenciar as informações dos motoristas no contexto do MDM, incluindo dados de identificação, contato e habilitação.
 * @author Israel A. Possoli
 * @date 2026-02-12
 */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn
} from "typeorm";

export enum ShipmentStatus {
  PLANNED = "planned",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}



@Entity({ name: "shipment" })
@Index(["agent", "branch", "shipmentNumber"], { unique: true })
export class OdsShipment {
  /** Identificador único da viagem/romaneio/manifesto */
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Agent de integração */
  @Column({ name: "agent", type: "varchar", length: 40 })
  agent!: string;

  /** CNPJ da Filial */
  @Column({ name: "branch", type: "varchar", length: 14, nullable: true })
  branch?: string;  

  /** Número da viagem/romaneio/manifesto */
  @Column({ name: "shipment_number", type: "varchar", length: 20 })
  shipmentNumber!: string;

  /** Status da viagem/romaneio/manifesto */
  @Column({ type: "varchar", length: 12 })
  status!: ShipmentStatus;

  /** Status externo da viagem/romaneio/manifesto */
  @Column({ type: "varchar", length: 40, nullable: true })
  externalStatus?: string;

  /** Informações não mapeadas e específicas de cada fonte de dados (agentes) */
  @Column({ name: "additional_info", type: "jsonb", nullable: true })
  additionalInfo?: Record<string, any> | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  /** Timestamp de exclusão lógica (soft delete) */
  @DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;  
}

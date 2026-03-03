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
  Index
} from "typeorm";
import { OdsBase } from "./ods-base.entity.js";

export enum ShipmentStatus {
  PLANNED = "planned",
  IN_TRANSIT = "in_transit",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}



@Entity({ name: "shipment" })
@Index(["agent", "branch", "shipmentNumber"], { unique: true })
export class OdsShipment extends OdsBase {
  /** Identificador único da viagem/romaneio/manifesto */
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Número da viagem/romaneio/manifesto */
  @Column({ type: "varchar", length: 20 })
  shipmentNumber!: string;

  /** Status da viagem/romaneio/manifesto */
  @Column({ type: "varchar", length: 12 })
  status!: ShipmentStatus;

  /** Status externo da viagem/romaneio/manifesto */
  @Column({ type: "varchar", length: 40, nullable: true })
  externalStatus?: string;
}

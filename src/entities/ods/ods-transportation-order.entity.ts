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


@Entity({ name: "transportation_order" })
@Index(["agent", "customerOrderNumber", "customerTaxId"], { unique: true })
export class OdsTransportationOrder {
  /** Identificador único da ordem de transporte do cliente*/
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Agent de integração */
  @Column({ name: "agent", type: "varchar", length: 40 })
  agent!: string;

  /** CNPJ da Filial */
  @Column({ name: "branch", type: "varchar", length: 14, nullable: true })
  branch?: string;  

  /** Número da ordem de transporte do cliente */
  @Column({ name: "customer_order_number", type: "varchar", length: 20, nullable: true })
  customerOrderNumber?: string;

  /** Número da ordem de transporte */
  @Column({ name: "order_number", type: "varchar", length: 20 })
  orderNumber!: string;

  /** Status da ordem de transporte */
  @Column({ type: "varchar", length: 12, nullable: true })
  status?: string;

  /** Status externo da ordem de transporte */
  @Column({ type: "varchar", length: 40, nullable: true })
  externalStatus?: string;

  /** Identificador fiscal do cliente (CNPJ, EIN, VAT Number, etc) */
  @Column({ name: "customer_tax_id", type: "varchar", length: 20, nullable: true })
  customerTaxId?: string;

  /** Identificador fiscal da origem do transporte (CNPJ, EIN, VAT Number, etc) */
  @Column({ name: "origin_tax_id", type: "varchar", length: 20, nullable: true })
  originTaxId?: string;

  /** Identificador fiscal do destino do transporte (CNPJ, EIN, VAT Number, etc) */
  @Column({ name: "destination_tax_id", type: "varchar", length: 20, nullable: true })
  destinationTaxId?: string;

  // --------------------------------------------------------------------------------------
  // Datas previstas e confirmadas para os eventos de transporte
  // --------------------------------------------------------------------------------------
  /** Data de solicitação pelo cliente para a coleta da ordem de transporte*/
  @Column({ name: "pickup_request", type: "timestamptz", nullable: true })
  pickupRequest?: Date;

  /** Data de solicitação pelo cliente para a entrega da ordem de transporte */
  @Column({ name: "delivery_request", type: "timestamptz", nullable: true })
  deliveryRequest?: Date;

  /** Data confirmada pelo transportador para a coleta da ordem de transporte */
  @Column({ name: "confirmed_pickup", type: "timestamptz", nullable: true })
  confirmedPickup?: Date;

  /** Data confirmada pelo transportador para a entrega da ordem de transporte */
  @Column({ name: "confirmed_delivery", type: "timestamptz", nullable: true })
  confirmedDelivery?: Date;


  /** Informações não mapeadas e específicas de cada fonte de dados (agentes) */
  @Column({ name: "additional_info", type: "jsonb", nullable: true })
  additionalInfo?: Record<string, any> | null;


  // --------------------------------------------------------------------------------------
  // Campos de controle de criação, atualização e exclusão lógica (soft delete)
  // --------------------------------------------------------------------------------------    
  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  /** Timestamp de exclusão lógica (soft delete) */
  @DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;  
}

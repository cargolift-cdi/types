/**
 * @fileoverview Entidade Driver para MDM, representando um motorista com seus dados pessoais e de habilitação.
 * Esta entidade é utilizada para armazenar e gerenciar as informações dos motoristas no contexto do MDM, incluindo dados de identificação, contato e habilitação.
 * @author Israel A. Possoli
 * @date 2026-02-12
 */
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";


export class OdsBase {
  /** Agent de integração */
  @Column({ name: "agent", type: "varchar", length: 40 })
  agent!: string;

  /** CNPJ da Filial */
  @Column({ name: "branch", type: "varchar", length: 14, nullable: true })
  branch?: string;

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

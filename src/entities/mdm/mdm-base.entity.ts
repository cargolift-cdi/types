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

export interface SourceStatus {
  [source: string]: {
    status: "active" | "inactive" | "suspended" | "deleted";
    reason?: string | null;
  };
}

export interface SourceAdditionalInfo {
  [source: string]: Record<string, any>;
}


export class MdmBase {
  /** Permite armazenar dados específicos de cada sistema de origem, sem impactar a estrutura principal da entidade. */
  @Column({ name: "source_additional_info", type: "jsonb", nullable: true })
  sourceAdditionalInfo?: SourceAdditionalInfo | null;
  
  /** Informações de status provenientes dos sistemas de origem, permitindo rastrear o status do registro em cada sistema de origem */
  @Column({ name: "source_status", type: "jsonb", nullable: true })
  sourceStatus?: SourceStatus | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  /** Timestamp de exclusão lógica (soft delete) */
  @DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null;
}

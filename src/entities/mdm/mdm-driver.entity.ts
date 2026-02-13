/**
 * @fileoverview Entidade Driver para MDM, representando um motorista com seus dados pessoais e de habilitação.
 * Esta entidade é utilizada para armazenar e gerenciar as informações dos motoristas no contexto do MDM, incluindo dados de identificação, contato e habilitação.
 * @author Israel A. Possoli
 * @date 2026-02-12
 */
import { Column, Entity, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "driver" })
@Index(["cpf"], { unique: true })
export class MdmDriver {
  /** Identificador único do motorista */
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Nome completo do motorista */
  @Column({ type: "varchar", length: 255 })
  name!: string;

  /** CPF do motorista (somente números, sem formatação) */
  @Column({ type: "varchar", length: 11 })
  cpf!: string;

  /** Número da CNH do motorista */
  @Column({ type: "varchar", length: 20 })
  cnhNumber!: string;

  /** Categoria da CNH (ex: A, B, C, D, E) */
  @Column({ type: "varchar", length: 2 })
  cnhCategory!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;  
}

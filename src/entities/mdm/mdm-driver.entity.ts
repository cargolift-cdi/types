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
import { MdmBase } from "./mdm-base.entity.js";

@Entity({ name: "driver" })
@Index(["cpf"], { unique: true })
export class MdmDriver extends MdmBase {
  /** Identificador único do motorista */
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** CPF do motorista (somente números, sem formatação) */
  @Column({ type: "varchar", length: 11 })
  cpf!: string;

  /** Nome completo do motorista */
  @Column({ type: "varchar", length: 255 })
  name!: string;

  /** Cidade */
  @Column({ type: "varchar", length: 100, nullable: true })
  city!: string;

  /** Número da CNH do motorista */
  @Column({ type: "varchar", length: 20, nullable: true })
  cnhNumber!: string;

  /** Categoria da CNH (ex: A, B, C, D, E) */
  @Column({ type: "varchar", length: 2, nullable: true })
  cnhCategory!: string;
}

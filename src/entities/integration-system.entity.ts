/**
 * Representa um sistema de integração registrado na aplicação.
 *
 * Cada instância mapeia uma linha da tabela "integration_system".
 *
 * @property id Identificador único do sistema de integração (armazenado como bigint no banco). Mantém-se como string no TypeScript para evitar perda de precisão com bigints.
 * @property system Nome único do sistema de integração (ex.: 'erp', 'tms'). Campo varchar com até 80 caracteres.
 * @property active Flag que indica se o sistema está ativo. Valor booleano; padrão: true.
 * @property createdAt Carimbo de data/hora de criação (timestamptz).
 * @property updatedAt Carimbo de data/hora da última atualização (timestamptz).
 */
import { Column, Entity, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'integration_system' })
@Index(["system"], { unique: true })
export class IntegrationSystem {
  /** Identificador único do sistema de integração */
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Nome do sistema de integração (e.g., 'erp', 'tms') */
  @Column({ type: 'varchar', length: 80 })
  system!: string; 

  /** Se o sistema está ativo */
  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

}


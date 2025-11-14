import { Column, Entity, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'integration_system' })
export class IntegrationSystem {
  /** Identificador único do sistema de integração */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Nome do sistema de integração (e.g., 'erp', 'tms') */
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 80 })
  system!: string; 

  /** Se o sistema está ativo */
  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ name: "create_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "update_at", type: "timestamptz" })
  updatedAt!: Date;

}


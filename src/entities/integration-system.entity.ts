import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

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
}


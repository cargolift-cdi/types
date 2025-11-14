import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthType } from './integration.enums.js';


/**
 * Perfil de credenciais reutilizáveis para autenticação (API Key, Basic, Bearer, OAuth2).
 * Utilize credentialId no IntegrationOutbound para referenciar estas credenciais.
 */
@Entity({ name: 'integration_credential' })
@Index(['name'], { unique: true })
export class IntegrationCredential {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /** Nome amigável único (ex.: 'erp-prod', 'wms-staging') */
  @Column({ type: 'varchar', length: 120 })
  name!: string;

  /** Se a credencial está ativa */
  @Column({ type: 'boolean', default: true })
  active!: boolean;  

  /**
   * Tipo de autenticação: 'apiKey' | 'basic' | 'bearer' | 'oauth2'
   * Mantido como string para flexibilidade sem precisar de enum em migrations.
   */
  @Column({ type: 'varchar', length: 30 })
  type!: AuthType;

  /**
   * Configuração não sensível:
   *  - apiKey: { headerName?: string, queryName?: string, prefix?: string }
   *  - basic: { usernameField?: string }
   *  - bearer: { headerName?: string, prefix?: string }
   *  - oauth2: { tokenUrl: string, clientId: string, scopes?: string[], audience?: string, resource?: string, authStyle?: 'body'|'basic' }
   */
  @Column({ type: 'jsonb', nullable: true })
  config?: Record<string, any> | null;

  /**
   * Segredos sensíveis (não selecionados por padrão):
   *  - apiKey: { value: string }
   *  - basic: { username: string, password: string }
   *  - bearer: { token: string }
   *  - oauth2: { clientSecret: string, username?: string, password?: string, privateKey?: string }
   */
  @Column({ type: 'jsonb', nullable: true, select: false })
  secrets?: Record<string, any> | null;



  /** Metadados de rotação/expiração de credenciais */
  @Column({ type: 'jsonb', nullable: true })
  rotation?: {
    rotatedAt?: string;
    expiresAt?: string;
    notes?: string;
  } | null;

  @CreateDateColumn({ name: "create_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "update_at", type: "timestamptz" })
  updatedAt!: Date;

}

/**
 * Representa um perfil de credenciais reutilizáveis para autenticação (API Key, Basic, Bearer, OAuth2).
 *
 * @remarks
 * - Registra configurações não sensíveis em `config`.
 * - Armazena segredos sensíveis em `secrets` (campo não selecionado por padrão).
 * - Referencie este registro pela sua `id` (ex.: `credentialId` em IntegrationOutbound).
 * - Entidade mapeada para a tabela "integration_credential".
 *
 * Campos:
 * @property config: Configurações não sensíveis específicas do tipo de autenticação. Exemplos:
 *   - apiKey: { headerName?: string, queryName?: string, prefix?: string }
 *   - basic:  { usernameField?: string }
 *   - bearer: { headerName?: string, prefix?: string }
 *   - oauth2: { tokenUrl: string, clientId: string, scopes?: string[], audience?: string, resource?: string, authStyle?: 'body'|'basic' }
 * @property secrets: Segredos sensíveis (select: false). Exemplos:
 *   - apiKey: { value: string }
 *   - basic:  { username: string, password: string }
 *   - bearer: { token: string }
 *   - oauth2:  { clientSecret: string, username?: string, password?: string, privateKey?: string }
 *   => Nunca exponha `secrets` em logs ou respostas sem proteção. Recomendado encriptar em repouso e limitar leitura.
 * - rotation: Metadados opcionais para rotação/expiração: { rotatedAt?: string, expiresAt?: string, notes?: string }.
 * - createdAt / updatedAt: Carimbos de data de criação/atualização.
 *
 * Boas práticas de segurança:
 * - Mantenha `secrets` com acesso restrito; carregue explicitamente quando necessário (ex.: query com select do campo).
 * - Evite armazenar segredos em texto simples fora do banco ou em logs.
 * - Implemente rotação periódica e registre `rotation.rotatedAt` / `rotation.expiresAt` quando aplicável.
 *
 *
 * @see IntegrationOutbound - referenciar credenciais por credentialId
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthType } from '../../../enum/integration.enums.js';
import { Credential, CredentialSecrets } from '../../../interfaces/integration.interface.js';


/**
 * Perfil de credenciais reutilizáveis para autenticação (API Key, Basic, Bearer, OAuth2).
 * Utilize credentialId no IntegrationOutbound para referenciar estas credenciais.
 */
@Entity({ name: 'integration_credential' })
@Index(['name'], { unique: true })
export class IntegrationCredential {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro


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
  config?: Credential | null;

  /**
   * Segredos sensíveis (não selecionados por padrão):
   *  - apiKey: { value: string }
   *  - basic: { username: string, password: string }
   *  - bearer: { token: string }
   *  - oauth2: { clientSecret: string, username?: string, password?: string, privateKey?: string }
   */
  @Column({ type: 'jsonb', nullable: true })
  secrets?: CredentialSecrets | null;



  /** Metadados de rotação/expiração de credenciais */
  @Column({ type: 'jsonb', nullable: true })
  rotation?: {
    rotatedAt?: string;
    expiresAt?: string;
    notes?: string;
  } | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

}
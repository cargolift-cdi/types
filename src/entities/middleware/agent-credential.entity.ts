
/**
 * @fileoverview Entidade MiddlewareAgentCredential — perfil de credenciais reutilizáveis.
 *
 * Cada registro define configuração (não sensível) e segredos (sensíveis) para um esquema
 * de autenticação. O campo `type` discrimina a forma do JSONB:
 *
 * ┌─────────────┬──────────────────────────────────────────────────┬────────────────────────────────────────────┐
 * │ type        │ config (público)                                 │ secrets (sensível, select: false)           │
 * ├─────────────┼──────────────────────────────────────────────────┼────────────────────────────────────────────┤
 * │ API_KEY     │ { headerName?, queryName?, prefix? }             │ { value }                                  │
 * │ BASIC       │ —                                                │ { username, password }                      │
 * │ BEARER      │ { headerName?, prefix? }                         │ { token }                                  │
 * │ OAUTH2_CC   │ { tokenUrl, clientId, scopes?, audience?,        │ { clientSecret }                           │
 * │             │   resource?, authStyle? }                        │                                            │
 * │ OAUTH2_PASS │ (mesmo do CC)                                    │ { clientSecret, username, password }        │
 * │ JWT         │ { tokenUrl, issuer?, audience?, algorithm? }     │ { privateKey }                             │
 * └─────────────┴──────────────────────────────────────────────────┴────────────────────────────────────────────┘
 *
 * Os campos `config` e `secrets` são tipados como Record<string, unknown> para aceitar
 * a forma plana do tipo discriminado. A validação real fica no runtime (auth strategies).
 *
 * @author Israel A. Possoli
 * @date 2026-01-06
 */
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthType } from '../../enum/integration.enums.js';
import { CredentialConfig, CredentialSecrets } from '../../interfaces/integration.interface.js';


@Entity({ name: 'agent_credential' })
@Index(['name'], { unique: true })
export class MiddlewareAgentCredential {
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Nome amigável único (ex.: 'erp-prod', 'wms-staging') */
  @Column({ type: 'varchar', length: 120 })
  name!: string;

  /** Se a credencial está ativa */
  @Column({ type: 'boolean', default: true })
  active!: boolean;

  /** Tipo de autenticação — discrimina as formas de config e secrets */
  @Column({ type: 'varchar', length: 30 })
  type!: AuthType;

  /**
   * Configuração não sensível (forma plana, discriminada por `type`).
   * Ex. (OAUTH2_CC): { tokenUrl: "https://…/token", clientId: "abc", scopes: ["read"] }
   */
  @Column({ type: 'jsonb', nullable: true })
  config?: CredentialConfig | null;

  /**
   * Segredos sensíveis — **não selecionados por padrão** (select: false no repositório).
   * Ex. (OAUTH2_CC): { clientSecret: "s3cret" }
   */
  @Column({ type: 'jsonb', nullable: true })
  secrets?: CredentialSecrets | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
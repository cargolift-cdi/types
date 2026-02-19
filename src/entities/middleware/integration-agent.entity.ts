/**
 * Representa um agente de integração registrado na aplicação.
 *
 * Cada instância mapeia uma linha da tabela "integration_agent".
 *
 * @property id Identificador único do agente de integração (armazenado como bigint no banco). Mantém-se como string no TypeScript para evitar perda de precisão com bigints.
 * @property agent Nome único do agente de integração (ex.: 'erp', 'tms'). Campo varchar com até 80 caracteres.
 * @property active Flag que indica se o agente está ativo. Valor booleano; padrão: true.
 * @property createdAt Carimbo de data/hora de criação (timestamptz).
 * @property updatedAt Carimbo de data/hora da última atualização (timestamptz).
 */
import { Column, Entity, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'integration_agent' })
@Index(["agent"], { unique: true })
export class IntegrationAgent {
  /** Identificador único do agente de integração */
  @PrimaryGeneratedColumn("identity", { type: "bigint", generatedIdentity: "ALWAYS" })
  id!: string; // manter string no TS para bigint seguro

  /** Nome do agente de integração (e.g., 'erp', 'tms') */
  @Column({ type: 'varchar', length: 80 })
  agent!: string; 

  /** Se o agente está ativo */
  @Column({ type: 'boolean', default: true })
  active!: boolean;

  /** Nome do usuário (clientId) no KeyCloak para consumir API do middleware */
  @Column({ name: "api_client_id", type: 'varchar', length: 80, nullable: true })
  apiClientId?: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}


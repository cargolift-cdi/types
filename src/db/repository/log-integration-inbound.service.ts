import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogIntegrationInbound } from '../entities/log/log-integration-inbound.entity.js';

/**
 * Repositório de diagnóstico de latência.
 * Responsável por criar/atualizar registros de latência associados a um id.
 */
@Injectable()
export class LogIntegrationInboundService {
  constructor(
    @InjectRepository(LogIntegrationInbound)
    private readonly repo: Repository<LogIntegrationInbound>
  ) {}

  /**
   * Cria um novo registro de latência.
   * @param id 
   * @param correlation_id 
   * @param timestamp_start 
   * @returns 
   */
  async register(
    system: string,
    event: string,
    action: string,
    correlationId?: string
  ): Promise<LogIntegrationInbound> {

    const logInbound = this.repo.create({
      system,
      event,
      action,
      correlationId
    });

    return this.repo.save(logInbound);
  }
}

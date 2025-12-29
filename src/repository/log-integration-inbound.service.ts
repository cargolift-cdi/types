import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogIntegrationInbound } from '../entities/log-integration-inbound.entity.js';
import { IntegrationStatus } from '../enum/integration.enums.js';

/**
 * Repositório de diagnóstico de latência.
 * Responsável por criar/atualizar registros de latência associados a um id.
 */
@Injectable()
export class LogInboundRepositoryService {
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
    correlationId: string,
    data: Partial<LogIntegrationInbound> = {}
  ): Promise<LogIntegrationInbound | null> {
    const payload = {
      system,
      event,
      action,
      correlationId,
      timestampLast: new Date(),
      ...data
    };

    if (data.status === IntegrationStatus.SUCCESS && payload.timestampStart) {
      const startTime = new Date(payload.timestampStart).getTime();
      const endTime = Date.now();
      payload.durationMs = endTime - startTime;
    }

    await this.repo.upsert(payload, ['correlationId']);

    return this.repo.findOne({
      where: {
        correlationId
      }
    });
  }

}

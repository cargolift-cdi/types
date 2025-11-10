import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticLatency } from '../entities/diagnostic-latency.entity.js';

/**
 * Repositório de diagnóstico de latência.
 * Responsável por criar/atualizar registros de latência associados a um id.
 */
@Injectable()
export class DiagnosticLatencyRepositoryService {
  constructor(
    @InjectRepository(DiagnosticLatency)
    private readonly repo: Repository<DiagnosticLatency>
  ) {}

  /**
   * Cria um novo registro de latência.
   * @param id 
   * @param correlation_id 
   * @param timestamp_start 
   * @returns 
   */
  async create(id: string, correlation_id: string, timestamp_start: Date): Promise<DiagnosticLatency> {

    const now = new Date();

      const entity = this.repo.create({
        id,
        correlationId: correlation_id,
        timestamp_start,
        timestamp_end: now,
        latencyMs: now.getTime() - timestamp_start.getTime(),
      });


    return this.repo.save(entity);
  }


}

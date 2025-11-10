import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
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
  async create(
    testId: string,
    correlation_id: string,
    timestamp_start: Date,
    data?: Record<string, any>
  ): Promise<DiagnosticLatency> {
    const now = new Date();

    const entity = this.repo.create({
      testId,
      correlationId: correlation_id,
      timestamp_start,
      timestamp_end: now,
      latencyMs: now.getTime() - timestamp_start.getTime(),
      data
    });

    return this.repo.save(entity);
  }


}

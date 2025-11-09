import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticLatency } from '../diagnostic-latency.entity.js';

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
   * Upsert de latência: cria se não existir, senão incrementa hit e atualiza timestamp_last.
   * Opcionalmente adiciona entrada no histórico (log).
   * @param id Identificador único do fluxo / teste.
   * @param logEntry Objeto livre para compor histórico.
   */
  async upsert(id: string, logEntry?: Record<string, any>): Promise<DiagnosticLatency> {
    let entity = await this.repo.findOne({ where: { id } });
    const now = new Date();

    if (entity) {
      entity.hit = (entity.hit || 0) + 1;
      entity.timestamp_last = now;
      if (logEntry) {
        if (!Array.isArray(entity.log)) entity.log = [];
        entity.log.push(logEntry);
      }
    } else {
      entity = this.repo.create({
        id,
        hit: 1,
        log: logEntry ? [logEntry] : [],
        timestamp_start: now,
        timestamp_last: now,
      });
    }

    return this.repo.save(entity);
  }

  /** Recupera registro pelo id. */
  async get(id: string): Promise<DiagnosticLatency | null> {
    return this.repo.findOne({ where: { id } });
  }

  /** Reinicia os contadores e histórico para o id informado. */
  async reset(id: string): Promise<DiagnosticLatency> {
    let entity = await this.repo.findOne({ where: { id } });
    const now = new Date();
    if (entity) {
      entity.hit = 0;
      entity.log = [];
      entity.timestamp_start = now;
      entity.timestamp_last = now;
    } else {
      entity = this.repo.create({ id, hit: 0, log: [], timestamp_start: now, timestamp_last: now });
    }
    return this.repo.save(entity);
  }
}

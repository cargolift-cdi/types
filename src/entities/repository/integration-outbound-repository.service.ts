import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationOutbound } from '../integration-outbound.entity.js';


@Injectable()
export class OutboundRepositoryService {
  constructor(
    @InjectRepository(IntegrationOutbound)
    private readonly repo: Repository<IntegrationOutbound>,
  ) {}

  async getRoutes(system: string, event: string): Promise<IntegrationOutbound[]> {
    return this.repo.find({ where: { system, event, active: true }, order: { version: 'DESC' } as any });
  }
}

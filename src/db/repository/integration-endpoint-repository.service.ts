import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationEndpoint } from '../entities/integration/integration-endpoint.js';


@Injectable()
export class EndpointRepositoryService {
  constructor(
    @InjectRepository(IntegrationEndpoint)
    private readonly repo: Repository<IntegrationEndpoint>,
  ) {}

  async findOne(endpointId: string): Promise<IntegrationEndpoint | null> {
    return await this.repo.findOne({ where: { id: endpointId, active: true }});
  }  
}

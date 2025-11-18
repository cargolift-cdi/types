import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationEndpoint } from '../entities/integration/integration-endpoint.js';
import { IntegrationCredential } from '../entities/integration/integration-credential.entity.js';


@Injectable()
export class EndpointRepositoryService {
  constructor(
    @InjectRepository(IntegrationEndpoint)
    private readonly repo: Repository<IntegrationEndpoint>,
    @InjectRepository(IntegrationCredential)
    private readonly repoCredential: Repository<IntegrationCredential>,
  ) {}

  async find(system: string, event: string): Promise<IntegrationEndpoint | null> {
    return await this.repo.findOne({ where: { system, event, active: true }});
  }

  async getCredential(endpoint: IntegrationEndpoint): Promise<IntegrationCredential | null> {
    if (!endpoint?.credentialId) return null;
    return await this.repoCredential.findOne({ where: { id: endpoint.credentialId, active: true }});
  }      
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationCredential } from '../entities/integration-credential.entity.js';


@Injectable()
export class CredentialRepositoryService {
  constructor(
    @InjectRepository(IntegrationCredential)
    private readonly repo: Repository<IntegrationCredential>,
  ) {}

  async find(credentialId: string): Promise<IntegrationCredential | null> {
    return await this.repo.findOne({ where: { id: credentialId, active: true }});
  }  
}

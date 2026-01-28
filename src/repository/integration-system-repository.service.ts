import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IntegrationSystem } from "../entities/integration-system.entity.js";

@Injectable()
export class SystemRepositoryService {
  constructor(
    @InjectRepository(IntegrationSystem)
    private readonly repo: Repository<IntegrationSystem>
  ) {}

  async get(system: string): Promise<IntegrationSystem | null> {
    return await this.repo.findOne({ where: { system, active: true } });
  }

  // Busca todos os sistemas ativos
  async getAllActive(): Promise<IntegrationSystem[]> {
    return await this.repo.find({ where: { active: true } });
  }

  // Busca o sistema com base no clientId do KeyCloak
  async getByApiClientId(apiClientId: string): Promise<IntegrationSystem | null> {
    return await this.repo.findOne({ where: { apiClientId, active: true } });
  }
}

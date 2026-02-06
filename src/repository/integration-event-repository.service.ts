import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IntegrationEvent } from "../entities/integration-entity.entity.js";

@Injectable()
export class EventRepositoryService {
  constructor(
    @InjectRepository(IntegrationEvent)
    private readonly repo: Repository<IntegrationEvent>
  ) {}

  async getFirstActive(event: string): Promise<IntegrationEvent | null> {
    return await this.repo.findOne({ where: { event, active: true }, order: { version: "DESC" } });
  }

  // Busca todos os eventos ativos
  async getAllActive(): Promise<IntegrationEvent[]> {
    return await this.repo.find({ where: { active: true } });
  }

  // Busca todos os eventos ativos
  async getAllActiveByRoutingMode(routingMode: IntegrationEvent["routingMode"]): Promise<IntegrationEvent[]> {
    return await this.repo.find({ where: { active: true, routingMode } });
  }
}

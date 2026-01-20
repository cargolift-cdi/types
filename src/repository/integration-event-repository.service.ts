import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IntegrationEvent } from "../entities/integration-event.entity.js";

@Injectable()
export class EventRepositoryService {
  constructor(
    @InjectRepository(IntegrationEvent)
    private readonly repo: Repository<IntegrationEvent>
  ) {}

  async getFirstActive(event: string): Promise<IntegrationEvent | null> {
    return await this.repo.findOne({ where: { event, active: true }, order: { version: "DESC" } });
  }
}

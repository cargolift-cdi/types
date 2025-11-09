import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IntegrationInbound } from "../integration-inbound.entity";


@Injectable()
export class InboundRepositoryService {
  constructor(
    @InjectRepository(IntegrationInbound)
    private readonly repo: Repository<IntegrationInbound>
  ) {}

  async getEvent(system: string, event: string): Promise<IntegrationInbound[]> {
    return this.repo.find({
      where: { system, event, active: true },
      order: { version: "DESC" } as any,
    })
    .then((events) => {
      return events;
    })
    .catch((err) => {
      throw err;
    });
  }

  /*
  async getRule(system: string, event: string): Promise<RulesConfiguration> {
    return this.repo
      .find({
        where: { system, event, active: true },
        order: { version: "DESC" } as any,
      })
      .then((events) => {
        if (events.length > 0) {
          return (events[0].rules || { rules: [] }) as RulesConfiguration;
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  async getTransformationExpression(system: string, event: string): Promise<string> {
    return this.repo
      .find({
        where: { system, event, active: true },
        order: { version: "DESC" } as any,
      })
      .then((events) => {
        if (events.length > 0) {
          return events[0].transformation || "";
        }
      })
      .catch((err) => {
        throw err;
      });
  }
      */
  
}

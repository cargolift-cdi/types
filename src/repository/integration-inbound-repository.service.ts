import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IntegrationInbound } from "../entities/integration-inbound.entity.js";


@Injectable()
export class InboundRepositoryService {
  constructor(
    @InjectRepository(IntegrationInbound)
    private readonly repo: Repository<IntegrationInbound>
  ) {}

  async get(system: string, event: string, action: string): Promise<IntegrationInbound[]> {
    const qb = this.repo
      .createQueryBuilder("integration_inbound")
      .where("integration_inbound.system = :system", { system })
      .andWhere("integration_inbound.event = :event", { event })
      .andWhere("integration_inbound.active = :active", { active: true })
      .andWhere(
        `(
          integration_inbound.action = 'all' OR
          integration_inbound.action = :action OR
          integration_inbound.action LIKE :actionListPrefix OR
          integration_inbound.action LIKE :actionListInfix OR
          integration_inbound.action LIKE :actionListSuffix
        )`,
        {
          action,
          actionListPrefix: `${action},%`,
          actionListInfix: `%,${action},%`,
          actionListSuffix: `%,${action}`,
        }
      );

    const rows = await qb
      .orderBy(
        `CASE
          WHEN integration_inbound.action = :action THEN 1
          WHEN integration_inbound.action LIKE :actionListPrefix OR
               integration_inbound.action LIKE :actionListInfix OR
               integration_inbound.action LIKE :actionListSuffix THEN 2
          WHEN integration_inbound.action = 'all' THEN 3
          ELSE 4
        END`,
        "ASC"
      )
      .addOrderBy("integration_inbound.system", "ASC")
      .addOrderBy("integration_inbound.event", "ASC")
      .addOrderBy("integration_inbound.version", "DESC")
      .getMany();

    const resultMap = new Map<string, IntegrationInbound>();

    for (const row of rows) {
      const key = `${row.system}::${row.event}`;
      if (!resultMap.has(key)) {
        resultMap.set(key, row);
      }
    }

    return Array.from(resultMap.values());
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

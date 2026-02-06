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

  async get(agent: string, entity: string, action: string): Promise<IntegrationInbound[]> {
    const qb = this.repo
      .createQueryBuilder("integration_inbound")
      .where("integration_inbound.agent = :agent", { agent })
      .andWhere("integration_inbound.entity = :entity", { entity })
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
      .addOrderBy("integration_inbound.entity", "ASC")
      .addOrderBy("integration_inbound.entity", "ASC")
      .addOrderBy("integration_inbound.version", "DESC")
      .getMany();

    const resultMap = new Map<string, IntegrationInbound>();

    for (const row of rows) {
      const key = `${row.entity}::${row.entity}::${row.action}`;
      if (!resultMap.has(key)) {
        resultMap.set(key, row);
      }
    }

    return Array.from(resultMap.values());
  }

  async getFirstActive(agent: string, entity: string, action: string): Promise<IntegrationInbound | null> {
    const records = await this.get(agent, entity, action);
    return records.length > 0 ? records[0] : null;
  }

  /*
  async getRule(entity: string, entity: string): Promise<RulesConfiguration> {
    return this.repo
      .find({
        where: { entity, entity, active: true },
        order: { version: "DESC" } as any,
      })
      .then((entitys) => {
        if (entitys.length > 0) {
          return (entitys[0].rules || { rules: [] }) as RulesConfiguration;
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  async getTransformationExpression(entity: string, entity: string): Promise<string> {
    return this.repo
      .find({
        where: { entity, entity, active: true },
        order: { version: "DESC" } as any,
      })
      .then((entitys) => {
        if (entitys.length > 0) {
          return entitys[0].transformation || "";
        }
      })
      .catch((err) => {
        throw err;
      });
  }
      */
  
}

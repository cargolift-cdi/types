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

  async get(agent: string, entity: string, method: string): Promise<IntegrationInbound[]> {
    const qb = this.repo
      .createQueryBuilder("integration_inbound")
      .where("integration_inbound.agent = :agent", { agent })
      .andWhere("integration_inbound.entity = :entity", { entity })
      .andWhere("integration_inbound.active = :active", { active: true })
      .andWhere(
        `(
          integration_inbound.method = 'all' OR
          integration_inbound.method = :method OR
          integration_inbound.method LIKE :methodListPrefix OR
          integration_inbound.method LIKE :methodListInfix OR
          integration_inbound.method LIKE :methodListSuffix
        )`,
        {
          method,
          methodListPrefix: `${method},%`,
          methodListInfix: `%,${method},%`,
          methodListSuffix: `%,${method}`,
        }
      );

    const rows = await qb
      .orderBy(
        `CASE
          WHEN integration_inbound.method = :method THEN 1
          WHEN integration_inbound.method LIKE :methodListPrefix OR
               integration_inbound.method LIKE :methodListInfix OR
               integration_inbound.method LIKE :methodListSuffix THEN 2
          WHEN integration_inbound.method = 'all' THEN 3
          ELSE 4
        END`,
        "ASC"
      )
      .addOrderBy("integration_inbound.agent", "ASC")
      .addOrderBy("integration_inbound.entity", "ASC")
      .addOrderBy("integration_inbound.version", "DESC")
      .getMany();

    const resultMap = new Map<string, IntegrationInbound>();

    for (const row of rows) {
      const key = `${row.agent}::${row.entity}::${row.method}`;
      if (!resultMap.has(key)) {
        resultMap.set(key, row);
      }
    }

    return Array.from(resultMap.values());
  }

  async getFirstActive(agent: string, entity: string, method: string): Promise<IntegrationInbound | null> {
    const records = await this.get(agent, entity, method);
    return records.length > 0 ? records[0] : null;
  }
  
}

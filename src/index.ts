import { setServers } from 'dns';
import { setDefaultCACertificates } from 'tls';

/**
 * Public export surface for shared types.
 * Keep exports stable to avoid breaking downstream projects.
 */
export * from './interfaces/rabbitmq.interfaces.js';
export * from './interfaces/envelope-message.interface.js';
export * from './interfaces/context-message.interface.js';
export * from './interfaces/publish-meta.interface.js';
export * from './interfaces/api-response.interface.js';
export * from './interfaces/integration.interface.js';
export * from './interfaces/payload-condition.interface.js';
export * from './interfaces/field-access-control.interface.js';
export * from './interfaces/schema-validation.interface.js';
export * from './interfaces/entity-metadados.interface.js';

export * from './interfaces/audit-trail.interface.js';


// Entidades
export * from './entities/middleware/integration-agent.entity.js';
export * from './entities/middleware/integration-entity.entity.js';
export * from './entities/middleware/routing-inbound.entity.js';
export * from './entities/middleware/routing-outbound.entity.js';
export * from './entities/middleware/integration-endpoint.entity.js';
export * from './entities/middleware/integration-credential.entity.js';
export * from './entities/middleware/diagnostic-latency.entity.js';
export * from './entities/middleware/log-routing-inbound.entity.js';
export * from './entities/middleware/log-integration-outbound.entity.js';
export * from './entities/middleware/log-mdm.entity.js';

// MDM
export * from './entities/mdm/mdm-driver.entity.js';
export * from './entities/shared/audit-trail.entity.js';

// Enum
export * from './enum/integration.enums.js';
export * from './enum/error-type.enum.js';

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

// Entidades
export * from './entities/integration-agent.entity.js';
export * from './entities/integration-entity.entity.js';
export * from './entities/integration-inbound.entity.js';
export * from './entities/integration-outbound.entity.js';
export * from './entities/integration-endpoint.entity.js';
export * from './entities/integration-credential.entity.js';
export * from './entities/diagnostic-latency.entity.js';
export * from './entities/log-integration-inbound.entity.js';
export * from './entities/log-integration-outbound.entity.js';



// Enum
export * from './enum/integration.enums.js';
export * from './enum/error-type.enum.js';

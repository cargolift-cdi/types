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

// Repositórios
export * from './repository/integration-agent-repository.service.js';
export * from './repository/integration-entity-repository.service.js';
export * from './repository/integration-inbound-repository.service.js';
export * from './repository/integration-outbound-repository.service.js';
export * from './repository/integration-endpoint-repository.service.js';
export * from './repository/integration-credential-repository.service.js';
export * from './repository/diagnostic-latency-repository.service.js';
export * from './repository/log-integration-inbound.service.js';
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

// Entidades
export * from './db/entities/integration/integration-system.entity.js';
export * from './db/entities/integration/integration-inbound.entity.js';
export * from './db/entities/integration/integration-outbound.entity.js';
export * from './db/entities/integration/integration-endpoint.entity.js';
export * from './db/entities/integration/integration-credential.entity.js';

export * from './db/entities/diagnostic-latency.entity.js';

// Enum
export * from './enum/integration.enums.js';
export * from './enum/error-type.enum.js';

// Repositórios
export * from './db/repository/integration-inbound-repository.service.js';
export * from './db/repository/integration-outbound-repository.service.js';
export * from './db/repository/integration-endpoint-repository.service.js';
export * from './db/repository/integration-credential-repository.service.js';
export * from './db/repository/diagnostic-latency-repository.service.js';

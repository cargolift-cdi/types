/**
 * Public export surface for shared types.
 * Keep exports stable to avoid breaking downstream projects.
 */
export * from './rabbitmq.interfaces.js';
export * from './rabbitmq-envelope-message.js';
export * from './context-message.interface.js';
export * from './publish-meta.interface.js';

// Entidades
export * from './db/entities/integration/integration.enums.js';
export * from './db/entities/integration/integration-system.entity.js';
export * from './db/entities/integration/integration-inbound.entity.js';
export * from './db/entities/integration/integration-outbound.entity.js';
export * from './db/entities/integration/integration-endpoint.js';
export * from './db/entities/integration/integration-credential.entity.js';

export * from './db/entities/diagnostic-latency.entity.js';

// Repositórios
export * from './db/repository/integration-inbound-repository.service.js';
export * from './db/repository/integration-outbound-repository.service.js';
export * from './db/repository/integration-endpoint-repository.service.js';
export * from './db/repository/integration-credential-repository.service.js';
export * from './db/repository/diagnostic-latency-repository.service.js';

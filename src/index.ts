/**
 * Public export surface for shared types.
 * Keep exports stable to avoid breaking downstream projects.
 */
export * from './rabbitmq.interfaces.js';
export * from './rabbitmq-envelope-message.js';
export * from './context-message.interface.js';
export * from './publish-meta.interface.js';

// Entidades e repositórios TypeORM
export * from './db/entities/integration-system.entity.js';
export * from './db/entities/integration-inbound.entity.js';
export * from './db/entities/integration-outbound.entity.js';
export * from './db/entities/diagnostic-latency.entity.js';

export * from './db/repository/integration-inbound-repository.service.js';
export * from './db/repository/integration-outbound-repository.service.js';
export * from './db/repository/diagnostic-latency-repository.service.js';

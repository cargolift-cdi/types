/**
 * Public export surface for shared types.
 * Keep exports stable to avoid breaking downstream projects.
 */
export * from './rabbitmq.interfaces.js';
export * from './rabbitmq-envelope-message.js';
export * from './context-message.interface.js';
export * from './publish-meta.interface.js';
export * from './entities/integration-system.entity.js';
export * from './entities/integration-inbound.entity.js';
export * from './entities/integration-outbound.entity.js';
export * from './entities/repository/integration-inbound-repository.service.js';
export * from './entities/repository/integration-outbound-repository.service.js';

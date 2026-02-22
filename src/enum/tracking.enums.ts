/**
 * Representa a etapa atual de uma requisição no pipeline de integração.
 * Utilizado para rastreamento end-to-end no IntegrationTracking.
 */
export enum TrackingCurrentStep {
  /** Requisição recebida pela API Hub */
  RECEIVED = "received",
  /** Processando no ESB (inbound: transformação, roteamento, BRE) */
  PROCESSING_ESB = "processing_esb",
  /** ESB roteou para fila(s) de destino */
  ROUTED = "routed",
  /** Processando no MDM Service */
  PROCESSING_MDM = "processing_mdm",
  /** Processando no conector de integração (outbound HTTP) */
  PROCESSING_OUTBOUND = "processing_outbound",
  /** Pipeline concluído com sucesso */
  COMPLETED = "completed",
  /** Pipeline concluído com falha */
  FAILED = "failed",
  /** Mensagem descartada (regra de negócio, duplicidade, etc) */
  DISCARDED = "discarded",
}

/**
 * Identificador do step individual dentro do pipeline.
 * Cada serviço registra um ou mais steps no array `steps` do tracking.
 */
export enum TrackingStepName {
  /** API Hub recebeu a requisição e publicou no RabbitMQ */
  API_RECEIVED = "api_received",
  /** ESB iniciou processamento da mensagem inbound */
  ESB_PROCESSING = "esb_processing",
  /** ESB concluiu transformação, BRE e roteamento para fila(s) de destino */
  ESB_ROUTED = "esb_routed",
  /** MDM Service iniciou processamento */
  MDM_PROCESSING = "mdm_processing",
  /** MDM Service concluiu persistência e auditoria */
  MDM_COMPLETED = "mdm_completed",
  /** MDM Service roteou para conectores de integração */
  MDM_ROUTING_OUTBOUND = "mdm_routing_outbound",
  /** Conector de integração iniciou envio para sistema parceiro */
  OUTBOUND_SENDING = "outbound_sending",
  /** Conector de integração recebeu resposta do sistema parceiro */
  OUTBOUND_RESPONSE = "outbound_response",
  /** Webhook disparado para subscriber */
  WEBHOOK_DISPATCHED = "webhook_dispatched",
}

/**
 * Serviço/módulo responsável pelo step de tracking.
 */
export enum TrackingService {
  API_HUB = "middleware-api",
  ESB = "middleware-esb",
  MDM_SERVICE = "middleware-mdm-service",
  CONNECTORS = "middleware-integration-connectors",
  WEBHOOK = "middleware-webhook",
}

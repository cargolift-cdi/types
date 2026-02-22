import { IntegrationStatus } from "../enum/integration.enums.js";
import { TrackingStepName, TrackingService } from "../enum/tracking.enums.js";

/**
 * Representa um step individual no rastreamento de uma requisição.
 * Armazenado como elementos do array JSONB `steps` em `IntegrationTracking`.
 *
 * Cada serviço do pipeline (API Hub, ESB, MDM, Connectors) adiciona
 * um ou mais steps conforme processa a mensagem.
 */
export interface TrackingStep {
  /** Nome/identificador do step */
  step: TrackingStepName;

  /** Serviço responsável pelo step */
  service: TrackingService;

  /** Status do step */
  status: IntegrationStatus;

  /** Motivo do status (mensagem curta, especialmente útil em falhas) */
  statusReason?: string | null;

  /** Agente de destino — relevante nos steps outbound (fan-out pode gerar N steps) */
  agent?: string | null;

  /** Timestamp ISO 8601 de início do step (preenchido automaticamente pelo repositório se não informado) */
  timestampStart?: string;

  /** Timestamp ISO 8601 de fim do step (null se ainda em andamento) */
  timestampEnd?: string | null;

  /** Duração do step em milissegundos */
  durationMs?: number | null;
}

/**
 * Payload mínimo para notificação via Webhook.
 * Enviado como corpo do POST para a URL inscrita.
 */
export interface WebhookPayload {
  /** Evento no formato entity.action (ex: driver.created, trip.updated) */
  event: string;

  /** Correlation ID da requisição originária */
  correlationId: string;

  /** Status final do pipeline */
  status: IntegrationStatus;

  /** Motivo do status */
  statusReason?: string | null;

  /** Timestamp ISO 8601 da conclusão */
  timestamp: string;

  /** Agente de origem (sistema que enviou a requisição) */
  agent: string;

  /** Entidade processada */
  entity: string;

  /** Ação executada */
  action: string;

  /** Chave de negócio da entidade */
  businessKey?: Record<string, any> | null;
}

/**
 * Configuração de política de retry para entrega de webhooks.
 */
export interface WebhookRetryPolicy {
  /** Número máximo de tentativas (padrão: 3) */
  maxRetries: number;

  /** Array de delays em ms entre tentativas (ex: [1000, 5000, 30000]) */
  backoffMs: number[];
}

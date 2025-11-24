/**
 * Metadados retornados após publicação confirmada no RabbitMQ.
 * Fornece visibilidade operacional (tamanho, tempo de confirmação, correlação).
 */
export interface PublishMeta {
  /** Correlation ID efetivamente utilizado no envelope */
  correlationId: string;
  /** Exchange onde a mensagem foi publicada */
  exchange: string;
  /** Routing key utilizada */
  routingKey: string;
  /** Pattern (normalmente igual à routingKey, mas pode ser sobrescrito) */
  pattern: string;
  /** Tamanho do payload serializado (em bytes) */
  sizeBytes: number;
  /** Duração (ms) entre início da publicação e confirmação */
  durationMs: number;
  /** Timestamp ISO da confirmação */
  confirmedAt: string;
}

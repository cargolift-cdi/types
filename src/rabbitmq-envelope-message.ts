import type contextMessage = require("./context-message.interface.js");

/**
 * Envelope (metadados) da mensagem publicada.
 */
export interface EnvelopeMessage {
  correlation_id?: string;
  eventType?: string;                     // Tipo do evento (ex: 'integration.erp.driver')
  event?: string;                         // Nome do recurso que está sendo transacionado: driver, trip, cte, nfse
  action?: string;                        // Ação realizada: CREATE, UPDATE, DELETE, GET
  method?: string;                        // ex: 'CREATE', 'UPDATE', 'DELETE', 'GET'
  record_id?: string;                     // ID do recurso que está sendo transacionado
  timestamp?: string;                     // ISO 8601 format
  source?: contextMessage.ContextSource;  // Sistema de origem da mensagem
  error?: contextMessage.ContextError;    // Detalhes do erro, se aplicável
  extraData?: { [key: string]: any };     // Qualquer dado extra relevante
}

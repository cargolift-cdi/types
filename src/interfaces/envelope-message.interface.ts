import { ContextSource, ContextError } from "./context-message.interface.js";


/**
 * Envelope (metadados) da mensagem publicada.
 */
export interface EnvelopeMessage {
  correlation_id?: string;
  eventType?: string;                     // Tipo do evento (ex: 'integration.erp.driver')
  system: string;                          // Sistema de integração (e.g., 'erp', 'tms')
  event?: string;                         // Nome do recurso que está sendo transacionado: driver, trip, cte, nfse
  action?: string;                        // Ação realizada: CREATE, UPDATE, DELETE, GET
  method?: string;                        // ex: 'CREATE', 'UPDATE', 'DELETE', 'GET'
  record_id?: string;                     // ID do recurso que está sendo transacionado
  timestamp?: string;                     // ISO 8601 format
  source?: ContextSource;  // Sistema de origem da mensagem
  error?: ContextError;    // Detalhes do erro, se aplicável
  extraData?: { [key: string]: any };     // Qualquer dado extra relevante
}

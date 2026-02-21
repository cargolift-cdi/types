import { ContextSource, ContextError } from "./context-message.interface.js";


/**
 * Envelope (metadados) da mensagem publicada.
 */
export interface EnvelopeMessage {
  correlation_id?: string;
  routingKey?: string;                     // Tipo do evento (ex: 'integration.erp.driver')
  agent?: string;                         // Agente de integração (e.g., 'erp', 'tms')
  endpoint?: string;                      // Nome do endpoint que está sendo transacionado: driver, trip, cte, nfse
  entity?: string;                        // Nome da entidade associada ao endpoint (ex: 'driver', 'trip', 'cte', 'nfse')
  action?: string;                        // Ação realizada: CREATE, UPDATE, DELETE, GET
  method?: string;                        // ex: 'CREATE', 'UPDATE', 'DELETE', 'GET'
  record_id?: string;                     // ID do recurso que está sendo transacionado
  timestamp?: string;                     // ISO 8601 format
  source?: ContextSource;                 // Sistema de origem da mensagem
  error?: ContextError;                   // Detalhes do erro, se aplicável
  sourceHeaders?: { [key: string]: any };       // Cabeçalhos de origem da mensagem
  extraData?: { [key: string]: any };     // Qualquer dado extra relevante
}

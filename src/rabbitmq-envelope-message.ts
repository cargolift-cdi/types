import type envelopeContextInterface = require("./context-message.interface.js");

/**
 * Envelope (metadados) da mensagem publicada.
 */
export interface EnvelopeMessage {
    correlation_id?: string;
    eventType?: string; // Tipo do evento (ex: 'integration.erp.driver')
    event?: string; // Nome do recurso que está sendo transacionado: driver, trip, cte, nfse
    action?: string; // Ação realizada: CREATE, UPDATE, DELETE, GET
    method?: string;    // ex: 'CREATE', 'UPDATE', 'DELETE', 'GET'
    record_id?: string; // ID do recurso que está sendo transacionado
    source?: envelopeContextInterface.ContextSource;
    timestamp?: string; // ISO 8601 format
    error?: envelopeContextInterface.ContextError;
    [key: string]: any; // Additional dynamic fields
}

import type envelopeContextInterface = require("./context-message.interface.js");

/**
 * Envelope (metadados) da mensagem publicada.
 */
export interface EnvelopeMessage {
    correlation_id?: string;
    eventType?: string; // Nome do recurso que está sendo transacionado: driver, trip, cte, nfse
    source?: envelopeContextInterface.ContextSource;
    method?: string;    // ex: 'CREATE', 'UPDATE', 'DELETE', 'GET'
    timestamp?: string; // ISO 8601 format
    error?: envelopeContextInterface.ContextError;
    [key: string]: any; // Additional dynamic fields
}

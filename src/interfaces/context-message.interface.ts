import { LogIntegrationInbound } from "../entities/middleware/log-integration-inbound.entity.js";
import { LogIntegrationOutbound } from "../entities/middleware/log-integration-outbound.entity.js";
import { ErrorSource, ErrorType, LogMdm } from "../index.js";

export interface ContextApplication {
    name: string;
    function?: string;
    action?: string;
    method?: string;
}

export interface ContextTrace {
    name?: string;    
    application: string;
    function: string;
    timestamp: string;
}


export interface ContextSource {
    ip?: string;
    user_agent?: string;
    client?: string;
    application?: string;
    user_name?: string;
    user_id?: string;
    user_email?: string;
}


export interface ContextError {
    code: string;
    message: string;
    type: ErrorType;
    source?: ErrorSource;
    stack_trace?: string;
}

export interface ContextMessage {
    correlation_id?: string;
    timestamp_start?: string;
    application?: ContextApplication;
    source?: ContextSource;
    trace?: ContextTrace[];
    error?: ContextError;
    warns?: string[];
    inbound?: LogIntegrationInbound;
    outbound?: LogIntegrationOutbound;
    mdm?: LogMdm;
    // Valor de referência para correlação de mensagens relacionadas, como um ID de negócio, chave de negócio, chave de entidade, etc.
    reference_key?: string;
}

// export type ContextErrorType = 'business' | 'application' | 'none';
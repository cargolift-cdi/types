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

export interface ContextIdentityRef {
  id?: string;
  username?: string;
  email?: string;
}

export interface ContextSource {
  ip?: string;
  user_agent?: string;
  subject?: string;
  audience?: string;
  application?: string;
  authentication?: ContextIdentityRef
  actor?: ContextIdentityRef;
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
  log?: {
    inbound?: LogIntegrationInbound;
    outbound?: LogIntegrationOutbound;
    mdm?: LogMdm;
  };
  // Valor de referência para correlação de mensagens relacionadas, como um ID de negócio, chave de negócio, chave de entidade, etc.
  reference_key?: Record<string, any>;
}

// export type ContextErrorType = 'business' | 'application' | 'none';

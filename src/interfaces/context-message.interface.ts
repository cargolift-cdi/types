import { LogRoutingInbound } from "../entities/middleware/log-routing-inbound.entity.js";
import { LogRoutingOutbound } from "../entities/middleware/log-integration-outbound.entity.js";
import { IntegrationTracking } from "../entities/middleware/integration-tracking.entity.js";
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
    inbound?: LogRoutingInbound;
    outbound?: LogRoutingOutbound;
    mdm?: LogMdm;
    tracking?: IntegrationTracking;
  };
  // Valor de referência para correlação de mensagens relacionadas, como um ID de negócio, chave de negócio, chave de entidade, etc.
  external_reference?: Record<string, any>;
  business_key?: Record<string, any>;
}

// export type ContextErrorType = 'business' | 'application' | 'none';

import { HttpMethod } from "../../../enum/integration.enums.js";

export interface EndpointHttpConfig {
  method: HttpMethod;
  pathTemplate?: string; // ex.: /v1/drivers/{{id}}
  headersTemplate?: Record<string, string>; // valores podem conter templates
  queryTemplate?: Record<string, any>;
  bodyTemplate?: any; // JSONata/Liquid/Handlebars
  contentType?: string; // 'application/json' | 'application/xml' | 'text/plain' | etc
  timeoutMs?: number;
  compression?: { type?: 'gzip' | 'deflate' | 'br' };
}

export interface EndpointQueueConfig {
  topic?: string;
  queue?: string;
  exchange?: string;
  routingKey?: string;
  partitionKey?: string;
  messageKey?: string;
  headersTemplate?: Record<string, string>; // valores podem conter templates
  properties?: Record<string, any>; // propriedades específicas do broker
  payloadTemplate?: any; // JSONata/Liquid/Handlebars
}

export interface EndpointTlsConfig  {
  rejectUnauthorized?: boolean;
  ca?: string; // certificado CA em PEM
  cert?: string; // certificado do cliente em PEM
  key?: string; // chave privada do cliente em PEM
}

export interface EndpointRetryPolicy {
  maxAttempts?: number;
  strategy?: 'exponential' | 'fixed';
  delayMs?: number;
  maxDelayMs?: number;
  jitter?: boolean;
}

export interface EndpointRateLimitConfig {
  strategy?: 'fixed-window' | 'token-bucket';
  limit?: number;
  intervalMs?: number;
  burst?: number;
}

export interface EndpointBreakerPolicy{ 
  threshold?: number;
  openMs?: number;
  halfOpenMaxAttempts?: number;
}

export interface EndpointIdempotencyConfig {
  strategy: 'header' | 'bodyHash' | 'custom';
  headerName?: string; // ex.: 'Idempotency-Key'
  ttlMs?: number; // tempo de vida da chave de idempotência
}

// src/integration/enums.ts
export enum TransportProtocol {
  REST = 'REST',
  SOAP = 'SOAP',
  GRAPHQL = 'GRAPHQL',
  AMQP = 'AMQP',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}


export enum AuthType {
  NONE = 'NONE',
  API_KEY = 'API_KEY',
  BASIC = 'BASIC',
  BEARER_STATIC = 'BEARER_STATIC',
  OAUTH2_CLIENT_CREDENTIALS = 'OAUTH2_CLIENT_CREDENTIALS',
  OAUTH2_PASSWORD = 'OAUTH2_PASSWORD',
  JWT = 'JWT',
}

export enum IntegrationStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  RETRYING = 'retrying',
  DISCARDED = 'discarded',
  // Status parcials para rotas de saída, quando nem todas rotas de saída concluíram com sucesso
  PARTIAL_SUCCESS = 'partial_success',
}


/*
export enum ApiKeyIn {
  HEADER = 'HEADER',
  QUERY = 'QUERY',
}
  */

/*
export enum BackoffStrategy {
  FIXED = 'FIXED',
  EXPONENTIAL = 'EXPONENTIAL',
  EXPONENTIAL_JITTER = 'EXPONENTIAL_JITTER',
}
  */
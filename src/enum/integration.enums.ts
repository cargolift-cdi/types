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
  OAUTH2_PASSWORD = 'OAUTH2_PASSWORD'
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
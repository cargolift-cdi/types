export enum ErrorType {
  NONE = 'none',
  APPLICATION = 'application',
  BUSINESS = 'business',
  MIDDLEWARE = 'middleware',
  CLIENT = 'client',
}

export enum ErrorSource {
  USER = "user",
  APPLICATION = "application",
  INFRASTRUCTURE = "infrastructure",
  EXTERNAL = "external",
  SETUP = "setup",
  CONFIGURATION = "configuration",
}

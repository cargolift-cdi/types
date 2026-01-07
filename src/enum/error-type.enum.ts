export enum ErrorType {
  BUSINESS = 'business',
  APPLICATION = 'application',
  BUSINESS_FATAL = 'business_fatal',
  APPLICATION_FATAL = 'application_fatal',
  USER = 'user',
  USER_FATAL = 'user_fatal',
  CLIENT = 'client',
  CLIENT_FATAL = 'client_fatal',
  NONE = 'none'
}

export declare type ErrorClassification = 'business' | 'application' | 'business_fatal' | 'application_fatal' | 'user' | 'user_fatal' | 'client' | 'client_fatal';
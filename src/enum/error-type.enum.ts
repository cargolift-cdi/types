export enum ErrorType {
  BUSINESS = 'business',
  APPLICATION = 'application',
  BUSINESS_FATAL = 'business_fatal',
  APPLICATION_FATAL = 'application_fatal'
}

export declare type ErrorClassification = 'business' | 'application' | 'business_fatal' | 'application_fatal';
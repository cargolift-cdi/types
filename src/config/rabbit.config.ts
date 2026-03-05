export interface RetryPolicyConfig {
  shortAttempts?: number;
  longAttempts?: number;
  shortMs: number;
  longMs: number;
}

export interface RabbitConfig {
  integration?: {
    host: string;
    prefetch?: number;
    exchange?: string;
    retryPolicy?: RetryPolicyConfig;
  };
  mdm?: {
    host: string;
    prefetch?: number;
    exchange?: string;
    retryPolicy?: RetryPolicyConfig;
  };
  ods?: {
    host: string;
    prefetch?: number;
    exchange?: string;
    retryPolicy?: RetryPolicyConfig;
  };

  diagnosticLatencyEnabled?: boolean;
  shutdownTimeoutMs?: number;
}

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
    type: ContextErrorType;
    code: string;
    message: string;
    stack_trace?: string;
}

export interface ContextMessage {
    correlation_id?: string;
    application?: ContextApplication;
    source: ContextSource;
    trace?: ContextTrace[];
    error?: ContextError;
}

export type ContextErrorType = 'business' | 'application' | 'none';
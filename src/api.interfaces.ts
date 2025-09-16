export type ApiErrorResponse = {
    statusCode: number;
    path: string;
    message: string;
    errorCode?: string | number;
};
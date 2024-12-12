export interface ApiResponse<T> {
    status: number;
    message: string;
    error?: string;
    data?: T;
    timestamp: string;
    path: string;
}
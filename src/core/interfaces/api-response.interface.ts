export interface ApiResponse<T> {
    status: number;
    message: string;
    errors?: [];
    data?: T;
    timestamp: string;
    path: string;
}
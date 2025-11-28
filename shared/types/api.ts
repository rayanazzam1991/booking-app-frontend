export interface ApiResponse<T> {
    success: boolean;
    error_code: number;
    message: string;
    data: T;
    pagination:PaginationResponse
}
export interface PaginationResponse {
    total: number,
    count: number,
    per_page: number,
    page: number
    max_page: number
}

import AppError from './AppError';

export default interface ApiResponse<T> {
    isSuccess: boolean;
    data: T | null;
    error: AppError | null;
}

import ApiResponse from './ApiResponse';
import AppError from './AppError';

class Result<T> {
    data: T | null;
    isSuccess = false;
    error: AppError | null = null;

    private constructor(
        isSuccess: boolean,
        data: T | null = null,
        error: AppError | null = null,
    ) {
        this.data = data;
        this.isSuccess = isSuccess;
        this.error = error;
    }

    static success<T>(data: T): ApiResponse<T> {
        return new Result(true, data);
    }

    static failure<T>(err: AppError | null): ApiResponse<T> {
        return new Result<T>(false, null, err);
    }
}

export default Result;

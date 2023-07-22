import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import AppError from 'src/types/AppError';
import Result from 'src/types/Result';

interface InbuiltExceptionResponse {
    message: Array<string> | string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let error: AppError;
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof HttpException) {
            const resp = exception.getResponse() as InbuiltExceptionResponse;
            error = {
                message:
                    resp.message instanceof Array
                        ? resp.message[0]
                        : resp.message,
            };
            status = exception.getStatus();
        } else {
            error = {
                message: 'Internal server error',
            };
        }

        return response.status(status).json(Result.failure(error));
    }
}

import {
    ExecutionContext,
    Injectable,
    NestInterceptor,
    CallHandler,
    HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/core';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap({
                error: (exception) => {
                    if (exception instanceof HttpException) {
                        exception.getStatus() >= 500 &&
                            Sentry.captureException(exception);
                    } else {
                        Sentry.captureException(exception);
                    }
                },
            }),
        );
    }
}

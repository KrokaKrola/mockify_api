import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import * as chalk from 'chalk';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logger Interceptor.
 * Creates informative logs to all requests, showing the path and
 * the method name.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const parentType = chalk.hex('#e3fc17').bold(`${context.getArgs()[0].route.path}`);

        // Get the method name without applying chalk
        const methodName = context.getArgs()[0].route.stack[0].method;

        // Convert the method name to uppercase and then apply chalk
        const fieldName = chalk.hex('#e3fc17').bold(methodName.toUpperCase());

        const start = performance.now();

        return next.handle().pipe(
            tap(() => {
                const end = performance.now();
                const status = chalk
                    .hex('#17e1fc')
                    .bold(`${context.switchToHttp().getResponse().statusCode}`);
                const tookTime = chalk.hex('#17e1fc').bold(`${(end - start).toFixed(0)}ms`);
                Logger.debug(
                    `🟣Path: ${parentType} Method: ${fieldName}, Status: ${status} Took: ${tookTime}`,
                    'REST',
                );
            }),
            catchError((error) => {
                const end = performance.now();
                const tookTime = chalk.hex('#17e1fc').bold(`${(end - start).toFixed(0)}ms`);
                const status = chalk.hex('#fc1717').bold(error.status);
                const message = chalk.hex('#fc1717').bold(error.message);
                Logger.error(
                    `🔴Path: ${parentType} Method: ${fieldName}, Took: ${tookTime}, Error status: ${status}, Error message: ${message}`,
                    'REST',
                );

                return throwError(error); // rethrow the error to keep the error handling consistent
            }),
        );
    }
}

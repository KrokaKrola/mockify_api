import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import * as chalk from 'chalk';
import { Observable } from 'rxjs';
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

        const start = new Date().getTime();

        return next.handle().pipe(
            tap(() => {
                const end = new Date().getTime();
                const tookTime = chalk.hex('#17e1fc').bold(`${end - start}ms`);
                Logger.debug(`Path: ${parentType} Method: ${fieldName}, Took: ${tookTime}`, 'REST');
            }),
        );
    }
}

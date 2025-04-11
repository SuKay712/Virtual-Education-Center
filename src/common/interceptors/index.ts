import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const start = new Date();
    console.log(
      `\x1b[32m${start.toLocaleString()}: [START] ${method} ${url}\x1b[0m`
    ); // Màu xanh lá

    return next.handle().pipe(
      tap(() => {
        const end = new Date();
        const duration = end.getTime() - start.getTime();
        console.log(
          `\x1b[31m${end.toLocaleString()}: [END] ${method} ${url} - Duration: ${duration}ms\x1b[0m`
        ); // Màu đỏ
      })
    );
  }
}

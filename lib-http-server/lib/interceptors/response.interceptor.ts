import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class HttpTransformInterceptor<T> implements NestInterceptor<T, ISuccessResponse<T>> {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<ISuccessResponse<T>> {
        return next.handle().pipe(
            map((data: T) => {
                return { data, status: "OK", timestamp: Date.now() };
            })
        );
    }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Request } from 'express'
import { Observable, tap } from 'rxjs'
import * as requestId from 'request-ip'

interface IData<T> {
  data: T
}

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<IData<any>> {
    const req = context.switchToHttp().getRequest<Request>()
    console.log(requestId.getClientIp(req))
    return next.handle().pipe(
      tap((ev) => {
        console.log(ev)
      })
    )
  }
}

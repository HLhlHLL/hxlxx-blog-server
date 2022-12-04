import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext
} from '@nestjs/common'
import { map, Observable } from 'rxjs'

interface IData<T> {
  data: T
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<IData<any>> {
    return next.handle().pipe(
      map((data) => {
        return {
          code: 200,
          status: 'success',
          message: '成功',
          data
        }
      })
    )
  }
}

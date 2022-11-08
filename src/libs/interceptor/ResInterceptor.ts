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
export default class ResInterCeptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<IData<any>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          status: 0,
          message: '成功',
          success: true
        }
      })
    )
  }
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Request, Response } from 'express'
import { Observable, tap } from 'rxjs'
import { OperationLogger } from 'src/api/operation-logger/entities/operation-logger.entity'
import { User } from 'src/api/user/entities/user.entity'
import { EntityManager } from 'typeorm'

@Injectable()
export class OperationLoggerInterceptor implements NestInterceptor {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly jwtService: JwtService
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    return next.handle().pipe(
      tap(async (data) => {
        if (request.method !== 'GET' && request.path !== '/login') {
          const token = request.headers.authorization.split(' ')[1] || ''
          const { email } = this.jwtService.decode(token) as any
          const { ip, address } = (
            await this.manager.findBy(User, { email })
          )[0]
          const logger = new OperationLogger()
          logger.path = request.path
          logger.request_type = request.method
          logger.parameter = request.body
          logger.username = email
          logger.ip = ip
          logger.address = address
          logger.status_code = response.statusCode
          logger.response = data
          await this.manager.save(logger)
        }
      })
    )
  }
}

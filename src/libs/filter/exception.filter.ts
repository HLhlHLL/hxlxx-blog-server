import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class ExcFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()
    const status = exception.getStatus()
    res.status(status).json({
      code: 400,
      status,
      message: exception.getResponse(),
      time: new Date(),
      method: req.method,
      path: req.url
    })
  }
}

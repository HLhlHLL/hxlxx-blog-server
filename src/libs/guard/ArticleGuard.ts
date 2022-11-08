import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

@Injectable()
export default class ArticleGuard implements CanActivate {
  constructor(private readonly Reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp()
    const req = ctx.getRequest<Request>()
    const token = req.headers.token as string
    try {
      const obj = jwt.verify(token, 'hxlxx123')
      return true
    } catch (error) {
      throw new HttpException(error, HttpStatus.FORBIDDEN)
    }
  }
}

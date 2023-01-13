import { Injectable, NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Request } from 'express'
import { User } from 'src/api/user/entities/user.entity'
import { OperationLogger } from 'src/api/operation-logger/entities/operation-logger.entity'
import { EntityManager } from 'typeorm'

@Injectable()
export class OperationLoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly jwtService: JwtService
  ) {}

  async use(req: Request, res: any, next: (error?: any) => void) {
    if (req.method !== 'GET') {
      const token = req.headers.authorization.split(' ')[1] || ''
      const { username } = this.jwtService.decode(token) as any
      const { ip, address } = (await this.manager.findBy(User, { username }))[0]
      const logger = new OperationLogger()
      logger.path = req.path
      logger.request_type = req.method
      logger.parameter = req.body
      logger.username = username
      logger.ip = ip
      logger.address = address
      await this.manager.save(logger)
    }
    next()
  }
}

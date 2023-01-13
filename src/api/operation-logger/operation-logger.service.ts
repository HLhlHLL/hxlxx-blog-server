import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OperationLogger } from './entities/operation-logger.entity'

@Injectable()
export class OperationLoggerService {
  constructor(
    @InjectRepository(OperationLogger)
    private readonly operationLoggerRep: Repository<OperationLogger>
  ) {}

  async getOperationLogger() {
    const res = await this.operationLoggerRep.find()
    return res
  }
}

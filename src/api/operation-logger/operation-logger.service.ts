import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { QueryInfo } from 'src/libs/types'
import { throwHttpException } from 'src/libs/utils'
import { EntityManager, Repository } from 'typeorm'
import { OperationLogger } from './entities/operation-logger.entity'

@Injectable()
export class OperationLoggerService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectRepository(OperationLogger)
    private readonly operationLoggerRep: Repository<OperationLogger>
  ) {}

  async getOperationLogger({ skip, limit }: QueryInfo) {
    const [res, count] = await this.operationLoggerRep.findAndCount({
      skip: skip ? parseInt(skip) : undefined,
      take: limit ? parseInt(limit) : undefined
    })
    return { res, count }
  }

  async removeById(id: number) {
    const { affected } = await this.operationLoggerRep.delete(id)
    if (affected > 0) {
      return '删除操作日志成功！'
    } else {
      throwHttpException('参数错误，删除操作日志失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async removeByIds(ids: number[]) {
    await this.manager.transaction(async (_manager) => {
      for (const id of ids) {
        await _manager.delete(OperationLogger, id)
      }
    })
    return '批量删除操作日志成功！'
  }
}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OperationLogger } from './entities/operation-logger.entity'
import { OperationLoggerController } from './operation-logger.controller'
import { OperationLoggerService } from './operation-logger.service'

@Module({
  imports: [TypeOrmModule.forFeature([OperationLogger])],
  controllers: [OperationLoggerController],
  providers: [OperationLoggerService]
})
export class OperationLoggerModule {}

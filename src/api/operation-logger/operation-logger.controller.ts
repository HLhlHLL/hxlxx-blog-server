import { Controller, Get } from '@nestjs/common'
import { OperationLoggerService } from './operation-logger.service'

@Controller('log')
export class OperationLoggerController {
  constructor(
    private readonly operationLoggerService: OperationLoggerService
  ) {}

  @Get('/operation')
  getOperationLogger() {
    return this.operationLoggerService.getOperationLogger()
  }
}

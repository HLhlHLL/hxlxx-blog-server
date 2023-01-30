import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards
} from '@nestjs/common'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { MenuGuard } from 'src/libs/guard/menu.guard'
import { QueryInfo } from 'src/libs/types'
import { OperationLoggerService } from './operation-logger.service'

@Controller('log')
@Menu(17)
@UseGuards(MenuGuard)
@UseGuards(JwtAuthGuard)
export class OperationLoggerController {
  constructor(
    private readonly operationLoggerService: OperationLoggerService
  ) {}
  // 获取所有操作日志
  @Get('/operation')
  @Menu(0)
  findAll(@Query() query: QueryInfo) {
    return this.operationLoggerService.findAll(query)
  }
  // 获取某条操作日志
  @Get('/operation/:id')
  @Menu(0)
  findById(@Param('id', new ParseIntPipe()) id: number) {
    return this.operationLoggerService.findById(id)
  }
  // 删除某条操作日志
  @Delete('/operation/remove-one')
  removeById(@Body('id', new ParseIntPipe()) id: number) {
    return this.operationLoggerService.removeById(id)
  }
  // 批量删除操作日志
  @Delete('operation/remove-all')
  removeByIds(@Body('ids') ids: number[]) {
    return this.operationLoggerService.removeByIds(ids)
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { MenuGuard } from 'src/libs/guard/menu.guard'
import { LinkDto } from './dto/link.dto'
import { LinkService } from './link.service'

@Controller('link')
@Menu(29)
@UseGuards(MenuGuard)
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  @Menu(0)
  create(@Body() link: LinkDto) {
    return this.linkService.create(link)
  }

  @Get()
  @Menu(0)
  find() {
    return this.linkService.find()
  }

  @Get('/all')
  @Menu(0)
  findAll(
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('limit', new ParseIntPipe()) limit: number
  ) {
    return this.linkService.findAll(skip, limit)
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  update(@Body() link: LinkDto) {
    return this.linkService.update(link)
  }

  // 删除某一条评论
  @Delete('/remove-one')
  @UseGuards(JwtAuthGuard)
  removeById(@Body('id', new ParseIntPipe()) id: number) {
    return this.linkService.removeById(id)
  }

  // 批量删除评论
  @Delete('/remove-all')
  @UseGuards(JwtAuthGuard)
  removeByIds(@Body('ids') ids: number[]) {
    return this.linkService.removeByIds(ids)
  }
}

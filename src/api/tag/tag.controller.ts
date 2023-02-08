import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common'
import { TagService } from './tag.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { ParseIntPipe } from '@nestjs/common'
import { QueryInfo } from 'src/libs/types'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { MenuGuard } from 'src/libs/guard/menu.guard'

@Controller('tag')
@Menu(9)
@UseGuards(MenuGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}
  // 新建文章标签
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto)
  }
  // 获取所有标签
  @Get()
  @Menu(0)
  findAll(@Query() query?: QueryInfo) {
    return this.tagService.findAll(query)
  }
  // 获取所有标签和对应的文章数量
  @Get('/tag-count')
  @Menu(0)
  findTagAndCount() {
    return this.tagService.findTagAndCount()
  }
  // 获取某一个标签
  @Get(':id')
  @Menu(0)
  findById(@Param('id', new ParseIntPipe()) id: number) {
    return this.tagService.findById(id)
  }
  // 更新某一个标签
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateTagDto: UpdateTagDto
  ) {
    return this.tagService.update(id, updateTagDto)
  }
  // 删除某一个标签
  @Delete('/remove-one')
  @UseGuards(JwtAuthGuard)
  removeById(@Body('id', new ParseIntPipe()) id: number) {
    return this.tagService.removeById(id)
  }
  // 批量删除标签
  @Delete('/remove-all')
  @UseGuards(JwtAuthGuard)
  removeByIds(@Body('ids') ids: number[]) {
    return this.tagService.removeByIds(ids)
  }
}

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
@UseGuards(JwtAuthGuard)
@UseGuards(MenuGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto)
  }

  @Get()
  @Menu(0)
  findAll(@Query() query?: QueryInfo) {
    return this.tagService.findAll(query)
  }

  @Get(':id')
  @Menu(0)
  findById(@Param('id', new ParseIntPipe()) id: number) {
    return this.tagService.findById(id)
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateTagDto: UpdateTagDto
  ) {
    return this.tagService.update(id, updateTagDto)
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.tagService.remove(id)
  }
}

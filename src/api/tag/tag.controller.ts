import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common'
import { TagService } from './tag.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { ParseIntPipe } from '@nestjs/common'

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto)
  }

  @Get()
  findAll() {
    return this.tagService.findAll()
  }

  @Get(':id')
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

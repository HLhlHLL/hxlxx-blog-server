import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query
} from '@nestjs/common'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { MenuGuard } from 'src/libs/guard/menu.guard'
import { CommentService } from './comment.service'
import { CreateCommentDto } from './dto/create-comment.dto'

@Controller('comment')
@Menu(23)
@UseGuards(MenuGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Menu(0)
  @UseGuards(JwtAuthGuard)
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto)
  }

  // 前台获取所有评论
  @Get()
  @Menu(0)
  findComments(
    @Query('type', new ParseIntPipe()) type: number,
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('limit', new ParseIntPipe()) limit: number,
    @Query('topic_id') topic_id?: string
  ) {
    return this.commentService.findComments(
      type,
      skip,
      limit,
      topic_id ? parseInt(topic_id) : 0
    )
  }

  // 后台获取所有评论
  @Get('/all')
  @Menu(0)
  findAll(
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('limit', new ParseIntPipe()) limit: number
  ) {
    return this.commentService.findAll(skip, limit)
  }

  @Get('/recently')
  @Menu(0)
  findRecently() {
    return this.commentService.findRecently()
  }

  @Get(':id')
  @Menu(0)
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id)
  }

  // 删除某一条评论
  @Delete('/remove-one')
  @UseGuards(JwtAuthGuard)
  removeById(@Body('id', new ParseIntPipe()) id: number) {
    return this.commentService.removeById(id)
  }

  // 批量删除评论
  @Delete('/remove-all')
  @UseGuards(JwtAuthGuard)
  removeByIds(@Body('ids') ids: number[]) {
    return this.commentService.removeByIds(ids)
  }
}

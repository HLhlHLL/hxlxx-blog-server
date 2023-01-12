import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { ParseIntPipe } from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { CreateDraftDto } from './dto/create-draft.dto'
import { QueryInfo, UpdateTopOrRec } from 'src/libs/types'
import { UpdateArticleDto } from './dto/update-article.dto'
import { UpdateDraftDto } from './dto/update-draft.dto'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { MenuGuard } from 'src/libs/guard/menu.guard'
import { Request } from 'express'

@Controller('article')
@Menu(6)
@UseGuards(MenuGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  // 新建文章
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() article: CreateArticleDto) {
    return this.articleService.create(article)
  }
  // 新建草稿
  @Post('/draft')
  @UseGuards(JwtAuthGuard)
  createDraft(@Body() draft: CreateDraftDto) {
    return this.articleService.create(draft)
  }
  // 查询所有文章
  @Get('/search')
  @Menu(0)
  findAll(@Query() query: QueryInfo) {
    return this.articleService.searchArticle(query)
  }
  // 查询已发布的文章
  @Get('/published')
  @Menu(0)
  findAllPublished(@Query() query: QueryInfo) {
    return this.articleService.findAllPublished(query)
  }
  // 查询草稿
  @Get('/draft')
  @Menu(0)
  findAllDraft(@Query() query: QueryInfo) {
    return this.articleService.findAllDraft(query)
  }
  // 获取某一篇文章
  @Get(':id')
  @Menu(0)
  findById(@Param('id', new ParseIntPipe()) id: number, @Req() req: Request) {
    return this.articleService.findById(id, req.clientIp.replace('::ffff:', ''))
  }
  // 更新文章
  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() article: UpdateArticleDto) {
    return this.articleService.update(article.id, article)
  }
  // 更新草稿
  @Patch('/draft')
  @UseGuards(JwtAuthGuard)
  updateDraft(@Body() article: UpdateDraftDto) {
    return this.articleService.update(article.id, article)
  }
  // 更新置顶状态
  @Patch('/top')
  @UseGuards(JwtAuthGuard)
  updateTop(@Body() status: UpdateTopOrRec) {
    return this.articleService.updateTop(status)
  }
  // 更新推荐状态
  @Patch('/recommend')
  @UseGuards(JwtAuthGuard)
  updateRecommend(@Body() status: UpdateTopOrRec) {
    return this.articleService.updateRecommend(status)
  }
  // 删除某一篇文章
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.articleService.remove(id)
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { ParseIntPipe } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import config from 'env.config'
import { CreateArticleDto } from './dto/create-article.dto'
import { CreateDraftDto } from './dto/create-draft.dto'
import { QueryInfo, UpdateTopOrRec } from 'src/libs/types'
import { UpdateArticleDto } from './dto/update-article.dto'
import { UpdateDraftDto } from './dto/update-draft.dto'

@Controller('article')
@UseGuards(JwtAuthGuard)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() article: CreateArticleDto) {
    return this.articleService.create(article)
  }

  @Post('/draft')
  createDraft(@Body() draft: CreateDraftDto) {
    return this.articleService.create(draft)
  }

  @Post('/cover')
  @UseInterceptors(FileInterceptor('file'))
  uploadCover(@UploadedFile() file: Express.Multer.File) {
    const cover_url = `${config.BASE_URL}/assets/article_cover/${file.filename}`
    return cover_url
  }

  @Get()
  findAll(@Query() query?: QueryInfo) {
    return this.articleService.findAll(query)
  }

  @Get('/published')
  findAllPublished(@Query() query?: QueryInfo) {
    return this.articleService.findAllPublished(query)
  }

  @Get('/draft')
  findAllDraft(@Query() query?: QueryInfo) {
    return this.articleService.findAllDraft(query)
  }

  @Get(':id')
  findById(@Param('id', new ParseIntPipe()) id: number) {
    return this.articleService.findById(id)
  }

  @Patch()
  update(@Body() article: UpdateArticleDto) {
    return this.articleService.update(article.id, article)
  }

  @Patch('/draft')
  updateDraft(@Body() article: UpdateDraftDto) {
    return this.articleService.update(article.id, article)
  }

  @Patch('/top')
  updateTop(@Body() status: UpdateTopOrRec) {
    return this.articleService.updateTop(status)
  }

  @Patch('/recommend')
  updateRecommend(@Body() status: UpdateTopOrRec) {
    return this.articleService.updateRecommend(status)
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.articleService.remove(id)
  }
}

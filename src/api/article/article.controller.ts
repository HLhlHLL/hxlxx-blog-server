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
  Query
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { ParseIntPipe } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import config from 'env.config'
import { ValidateArticlePipe } from 'src/libs/pipe/validate-article.pipe'
import { CreateArticleDto } from './dto/create-article.dto'
import { CreateDraftDto } from './dto/create-draft.dto'
import { QueryInfo } from 'src/libs/types'

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() article: CreateArticleDto) {
    return this.articleService.create(article)
  }

  @Post('/draft')
  async createDraft(@Body() draft: CreateDraftDto) {
    return this.articleService.createDraft(draft)
  }

  @Post('/cover')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCover(@UploadedFile() file: Express.Multer.File) {
    const cover_url = `${config.BASE_URL}/assets/article_cover/${file.filename}`
    return cover_url
  }

  @Get()
  findAll(@Query() query?: QueryInfo) {
    return this.articleService.findAll(query)
  }

  @Get('/published')
  async findAllPublished(@Query() query?: QueryInfo) {
    return this.articleService.findAllPublished(query)
  }

  @Get('/draft')
  async findAllDraft(@Query() query?: QueryInfo) {
    return this.articleService.findAllDraft(query)
  }

  @Get(':id')
  findById(@Param('id', new ParseIntPipe()) id: number) {
    return this.articleService.findById(id)
  }

  @Patch('/update')
  @UseInterceptors(FileInterceptor('article_cover'))
  async update(
    @Body(new ValidateArticlePipe(1)) article: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const cover_url = `${config.BASE_URL}/assets/article_cover/${file.filename}`
    return this.articleService.update(article.id, article, cover_url)
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.articleService.remove(id)
  }
}

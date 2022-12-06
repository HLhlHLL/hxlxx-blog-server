import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { ParseIntPipe } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import config from 'env.config'
import { ValidateArticlePipe } from 'src/libs/pipe/validate-article.pipe'

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('article_cover'))
  async create(
    @Body(new ValidateArticlePipe()) article: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const cover_url = `${config.BASE_URL}/assets/article_cover/${file.filename}`
    return this.articleService.create(article, cover_url)
  }

  @Get()
  findAll() {
    return this.articleService.findAll()
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

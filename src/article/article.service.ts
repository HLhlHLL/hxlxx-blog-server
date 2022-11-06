import { Injectable } from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Article } from './entities/article.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly article: Repository<Article>
  ) {}

  create(createArticleDto: CreateArticleDto) {
    console.log(createArticleDto)
    const article = new Article()
    article.title = createArticleDto.title
    article.content = createArticleDto.content
    article.description = createArticleDto.description
    return this.article.save(article)
  }

  findAll() {
    return `This action returns all article`
  }

  findOne(id: number) {
    return `This action returns a #${id} article`
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`
  }

  remove(id: number) {
    return `This action removes a #${id} article`
  }
}

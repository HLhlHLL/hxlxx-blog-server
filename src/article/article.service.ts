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
    const article = new Article()
    article.title = createArticleDto.title
    article.content = createArticleDto.content
    article.description = createArticleDto.description
    return this.article.save(article)
  }

  findAllArticle() {
    return this.article.find()
  }

  findArticleById(id: number) {
    return this.article.find({
      where: {
        id
      }
    })
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`
  }

  remove(id: number) {
    return `This action removes a #${id} article`
  }
}

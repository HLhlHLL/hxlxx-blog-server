import { Injectable } from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Article } from './entities/article.entity'
import { EntityManager, Repository } from 'typeorm'
import { Tag } from '../tag/entities/tag.entity'
import { Category } from '../category/entities/category.entity'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly articleRep: Repository<Article>,
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  async create({
    title,
    content,
    description,
    tag_ids,
    category_id
  }: CreateArticleDto) {
    const article = new Article()
    const articleTags = []
    for (const id of tag_ids) {
      const tag = await this.manager.findOneBy(Tag, { id })
      articleTags.push(tag)
    }
    const category = await this.manager.findOneBy(Category, { id: category_id })
    article.title = title
    article.content = content
    article.description = description
    article.tags = articleTags
    article.category = category
    // 赋值，建立关联
    const res = await this.manager.save(Article, article)
    return res
  }

  async findAll() {
    // const qb = this.manager.createQueryBuilder(Article, 'article')
    // const [res, count] = await qb
    //   .innerJoinAndSelect('article.tags', 'tag')
    //   .getManyAndCount()
    // return { res, count }
    const res = await this.articleRep.find({
      relations: ['tags', 'category']
    })
    const count = await this.articleRep.count()
    return { res, count }
  }

  async findById(id: number) {
    // const qb = this.manager.createQueryBuilder(Article, 'article')
    // const res = await qb
    //   .innerJoinAndSelect('article.tags', 'tag', 'article.id = :id', { id })
    //   .getOne()
    const res = this.articleRep.find({
      relations: ['tags', 'category'],
      where: { id }
    })
    return res
  }

  async update(
    id: number,
    { title, content, description, tag_ids }: UpdateArticleDto
  ) {
    // 更新 article
    await this.manager.update(Article, id, { title, content, description })
    const articleTags = []
    if (tag_ids.length) {
      for (const id of tag_ids) {
        // 更新 tag
        const _tag = await this.manager.findOneBy(Tag, { id })
        articleTags.push(_tag)
      }
    }
    // 更新article 和 tag 的关联
    const _article = await this.manager.findOneBy(Article, { id })
    _article.tags = articleTags
    await this.manager.save(Article, _article)
    return 'update article successfully'
  }

  async remove(id: number) {
    await this.articleRep.delete(id)
    return 'delete article successfully'
  }
}

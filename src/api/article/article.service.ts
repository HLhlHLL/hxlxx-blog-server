import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
    cover_url,
    author_id,
    tag_ids,
    category_id
  }: CreateArticleDto) {
    const article = new Article()
    const tags = []
    for (const id of tag_ids) {
      const tag = await this.manager.findOneBy(Tag, { id })
      tags.push(tag)
    }
    const category = await this.manager.findOneBy(Category, { id: category_id })
    article.title = title
    article.content = content
    article.description = description
    article.tags = tags
    article.category = category
    article.cover_url = cover_url
    article.author_id = author_id
    article.is_published = false
    article.created_at = new Date()
    article.updated_at = article.created_at
    // 赋值，建立关联
    const res = await this.manager.save(Article, article)
    return { id: res.id, title: res.title }
  }

  async findAll() {
    const [res, count] = await this.articleRep
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.tags', 'tag')
      .innerJoinAndSelect('article.category', 'category')
      .select([
        'article.id',
        'article.author_id',
        'article.title',
        'article.content',
        'article.description',
        'article.is_published',
        'article.created_at',
        'tag.id',
        'tag.tag_name',
        'category.id',
        'category.category_name'
      ])
      .getManyAndCount()
    return { res, count }
  }

  async findById(id: number) {
    const res = await this.articleRep
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.tags', 'tag')
      .innerJoinAndSelect('article.category', 'category')
      .select([
        'article.id',
        'article.author_id',
        'article.title',
        'article.content',
        'article.description',
        'article.is_published',
        'article.created_at',
        'tag.id',
        'tag.tag_name',
        'category.id',
        'category.category_name'
      ])
      .where({ id })
      .getOne()
    return res
  }

  async update(
    id: number,
    { title, content, description, tag_ids, category_id }: UpdateArticleDto
  ) {
    // 更新 article
    const { affected } = await this.articleRep.update(id, {
      title,
      content,
      description,
      updated_at: new Date()
    })
    if (affected > 0) {
      const tags = []
      if (tag_ids.length) {
        for (const id of tag_ids) {
          // 更新 tag
          const tag = await this.manager.findOneBy(Tag, { id })
          tag && tags.push(tag)
        }
      }
      // 更新article 和 tag 的关联
      const article = await this.articleRep.findOneBy({ id })
      tags.length && (article.tags = tags)
      if (category_id) {
        const category = await this.manager.findOneBy(Category, {
          id: category_id
        })
        category && (article.category = category)
      }
      await this.articleRep.save(article)
      return 'update article successfully'
    } else {
      throw new HttpException(
        'Update failed, please check the parameter',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async remove(id: number) {
    await this.articleRep.delete(id)
    return 'delete article successfully'
  }
}

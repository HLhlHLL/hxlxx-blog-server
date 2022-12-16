import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UpdateArticleDto } from './dto/update-article.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Article } from './entities/article.entity'
import { EntityManager, Repository } from 'typeorm'
import { Tag } from '../tag/entities/tag.entity'
import { Category } from '../category/entities/category.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { CreateDraftDto } from './dto/create-draft.dto'
import { QueryInfo } from 'src/libs/types'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly articleRep: Repository<Article>,
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  async create(articleDto: CreateArticleDto) {
    let article = new Article()
    const tags = []
    for (const id of articleDto.tag_ids) {
      const tag = await this.manager.findOneBy(Tag, { id })
      tags.push(tag)
    }
    const category = await this.manager.findOneBy(Category, {
      id: articleDto.category_id
    })
    article = Object.assign(article, articleDto)
    article.tags = tags
    article.category = category
    article.created_at = new Date()
    article.updated_at = article.created_at
    // 赋值，建立关联
    await this.manager.save(Article, article)
    return article
  }

  async createDraft(draft: CreateDraftDto) {
    let article = new Article()
    const tags = []
    for (const id of draft.tag_ids) {
      const tag = await this.manager.findOneBy(Tag, { id })
      tags.push(tag)
    }
    const category = await this.manager.findOneBy(Category, {
      id: draft.category_id
    })
    article = Object.assign(article, draft)
    article.tags = tags
    article.category = category
    article.created_at = new Date()
    article.updated_at = article.created_at
    // 赋值，建立关联
    await this.manager.save(Article, article)
    return article
  }

  async findAll(query?: QueryInfo) {
    const res = await Article.findAll(undefined, query)
    const count = await this.articleRep.count()
    return { res, count }
  }

  async findAllPublished(query?: QueryInfo) {
    const res = await Article.findAll(1, query)
    const count = await this.articleRep
      .createQueryBuilder()
      .select()
      .where('status = 1')
      .getCount()
    return { res, count }
  }

  async findAllDraft(query?: QueryInfo) {
    const res = await Article.findAll(0, query)
    const count = await this.articleRep
      .createQueryBuilder()
      .select()
      .where('status = 0')
      .getCount()
    return { res, count }
  }

  async findById(id: number) {
    const res = await Article.findById(id)
    return res
  }

  async update(
    id: number,
    { title, content, description, tag_ids, category_id }: UpdateArticleDto,
    cover_url: string
  ) {
    const _article: any = {
      title,
      content,
      description,
      updated_at: new Date()
    }
    cover_url && (_article.cover_url = cover_url)
    // 更新 article
    const { affected } = await this.articleRep.update(id, _article)
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
      return 'Update article successfully'
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

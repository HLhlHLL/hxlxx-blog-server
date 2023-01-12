import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UpdateArticleDto } from './dto/update-article.dto'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Article } from './entities/article.entity'
import { EntityManager, Repository } from 'typeorm'
import { Tag } from '../tag/entities/tag.entity'
import { Category } from '../category/entities/category.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { CreateDraftDto } from './dto/create-draft.dto'
import { QueryInfo, UpdateTopOrRec } from 'src/libs/types'
import { throwHttpException } from 'src/libs/utils'
import { UpdateDraftDto } from './dto/update-draft.dto'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private readonly articleRep: Repository<Article>,
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  async create(articleDto: CreateArticleDto | CreateDraftDto) {
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
    // 赋值，建立关联
    await this.manager.save(Article, article)
    return article
  }

  async searchArticle(query?: QueryInfo) {
    const res = await Article.searchArticle(query)
    const count = await this.articleRep
      .createQueryBuilder()
      .where('article.title like :keyword', {
        keyword: `%${query.keyword || ''}%`
      })
      .getCount()
    return { res, count }
  }

  async findAllPublished(query?: QueryInfo) {
    const res = await Article.findAll(query, 1)
    const count = await this.articleRep.countBy({ status: true })
    return { res, count }
  }

  async findAllDraft(query?: QueryInfo) {
    const res = await Article.findAll(query, 0)
    const count = await this.articleRep.countBy({ status: false })
    return { res, count }
  }

  async findById(id: number, ip: string) {
    const res = await Article.findById(id)
    if (ip !== '127.0.0.1') {
      await this.articleRep.update(id, { view_times: res.view_times + 1 })
    }
    return { res, ip }
  }

  async update(id: number, article: UpdateArticleDto | UpdateDraftDto) {
    const {
      tag_ids,
      category_id,
      tags,
      category,
      created_at,
      updated_at,
      ..._article
    } = article
    const { affected } = await this.articleRep.update(id, _article)
    if (affected > 0) {
      // 更新article 和 tag 的关联
      const article = await this.articleRep.findOneBy({ id })
      if (tag_ids?.length) {
        const tags = []
        for (const id of tag_ids) {
          // 更新 tag
          const tag = await this.manager.findOneBy(Tag, { id })
          tag && tags.push(tag)
        }
        tags.length && (article.tags = tags)
      }
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

  async updateTop(status: UpdateTopOrRec) {
    const { affected } = await this.articleRep
      .createQueryBuilder()
      .update()
      .set({ top: status.top })
      .where('id = :id', { id: status.id })
      .execute()
    if (affected > 0) {
      return 'Update article top successfully'
    } else {
      throwHttpException(
        'Update failed, please check the parameter',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async updateRecommend(status: UpdateTopOrRec) {
    const { affected } = await this.articleRep
      .createQueryBuilder()
      .update()
      .set({ recommend: status.recommend })
      .where('id = :id', { id: status.id })
      .execute()
    if (affected > 0) {
      return 'Update article recommend successfully'
    } else {
      throwHttpException(
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

import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { Article } from '../article/entities/article.entity'
import { Category } from '../category/entities/category.entity'
import { User } from '../user/entities/user.entity'
import { Site } from './entities/site.entity'

@Injectable()
export class SiteService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectRepository(Site) private readonly siteRep: Repository<Site>
  ) {}

  async getSiteInfo() {
    const userCount = await this.manager.count(User)
    const articleCount = await this.manager.count(Article)
    const articleCategoryCount = await this.manager
      .createQueryBuilder(Category, 'category')
      .innerJoinAndSelect('category.articles', 'article')
      .select('category_name')
      .addSelect('COUNT(category.id)', 'article_count')
      .groupBy('category.id')
      .getRawMany()
    const viewTimes = await this.manager.count(Site)
    return { userCount, articleCount, articleCategoryCount, viewTimes }
  }
}

import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { Article } from './api/article/entities/article.entity'
import { User } from './api/user/entities/user.entity'
import { Site } from './auth/entities/site.entity'

@Injectable()
export class AppService {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async getSiteInfo() {
    const userCount = await this.manager.count(User)
    const articleCount = await this.manager.count(Article)
    const site = await this.manager.createQueryBuilder(Site, 'site').getOne()
    return { userCount, articleCount, site }
  }
}

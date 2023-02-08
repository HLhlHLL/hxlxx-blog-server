import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { throwHttpException } from 'src/libs/utils'
import { EntityManager, Repository } from 'typeorm'
import { Article } from '../article/entities/article.entity'
import { Category } from '../category/entities/category.entity'
import { Tag } from '../tag/entities/tag.entity'
import { User } from '../user/entities/user.entity'
import { Site } from './entities/site.entity'
import { WebsiteConfig } from './entities/website-config.entity'

@Injectable()
export class SiteService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectRepository(Site) private readonly siteRep: Repository<Site>,
    @InjectRepository(WebsiteConfig)
    private readonly websiteRep: Repository<WebsiteConfig>
  ) {}

  async getSiteInfo() {
    const userCount = await this.manager.count(User)
    const articleCount = await this.manager.count(Article, {
      where: { status: true }
    })
    const articleCategoryCount = await this.manager
      .createQueryBuilder(Category, 'category')
      .innerJoinAndSelect('category.articles', 'article')
      .select('category_name')
      .addSelect('COUNT(category.id)', 'article_count')
      .groupBy('category.id')
      .getRawMany()
    const viewTimes = await this.manager.count(Site)
    const DAILY_TIME_OFFSET = 1000 * 60 * 60 * 24
    const WEEKLY_TIME_OFFSET = DAILY_TIME_OFFSET * 7
    const weeklyViewTimes = await this.manager
      .createQueryBuilder()
      .select(['s.date date', 'COUNT(s.date) count'])
      .from((sqb) => {
        return sqb
          .select('DATE_FORMAT(site.created_at, "%Y-%m-%d") date')
          .from(Site, 'site')
          .where('site.created_at >= :start and site.created_at < :end', {
            start: new Date(new Date().getTime() - WEEKLY_TIME_OFFSET),
            end: new Date()
          })
      }, 's')
      .groupBy('s.date')
      .orderBy('s.date', 'ASC')
      .getRawMany()
    return {
      userCount,
      articleCount,
      articleCategoryCount,
      viewTimes,
      weeklyViewTimes
    }
  }

  async getSiteProfile() {
    const articleCount = await this.manager.count(Article, {
      where: { status: true }
    })
    const categoryCount = await this.manager.count(Category)
    const tagAndCount = await this.manager
      .createQueryBuilder(Tag, 'tag')
      .innerJoinAndSelect('tag.articles', 'article')
      .select(['tag_name', 'tag.id id'])
      .addSelect('COUNT(tag.id)', 'count')
      .groupBy('tag.id')
      .getRawMany()
    const talkCount = 10
    const viewCount = await this.manager.count(Site)
    const websiteConfig = await this.getWebsiteConfig()
    return {
      articleCount,
      categoryCount,
      tagCount: tagAndCount.length,
      talkCount,
      viewCount,
      websiteConfig
    }
  }

  async getWebsiteConfig() {
    const config = (await this.websiteRep.find())[0]
    return config
  }

  async updateWbeSiteConfig(config) {
    const { id, ...webConfig } = config
    const { affected } = await this.websiteRep.update(id, webConfig)
    if (affected > 0) {
      return '更新网站配置成功！'
    } else {
      throwHttpException('参数错误，更新网站信息失败！', HttpStatus.BAD_REQUEST)
    }
  }
}

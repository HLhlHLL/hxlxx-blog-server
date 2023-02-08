import { Tag } from '../../tag/entities/tag.entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Category } from '../../category/entities/category.entity'
import { QueryInfo } from 'src/libs/types'
import { User } from 'src/api/user/entities/user.entity'

export enum ARTICLE_TYPE {
  ORIGINAL = 'original',
  REPRODUCE = 'reproduce',
  TRANSLATION = 'translation'
}

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number
  // 标题
  @Column({
    default: ''
  })
  title: string
  // 内容
  @Column({
    type: 'text'
  })
  content: string
  // 摘要
  @Column({
    default: ''
  })
  description: string
  // 封面地址
  @Column({
    default: ''
  })
  cover_url: string
  // 发布时间
  @CreateDateColumn()
  created_at: Date
  // 更新时间
  @UpdateDateColumn()
  updated_at: Date
  // 文章类型：原创、转载、翻译
  @Column({
    type: 'enum',
    enum: ARTICLE_TYPE,
    default: ARTICLE_TYPE.ORIGINAL
  })
  article_type: ARTICLE_TYPE
  // 访问次数
  @Column({
    default: 0
  })
  view_times: number
  // 文章状态：已发布、草稿
  @Column({
    default: true
  })
  status: boolean
  // 置顶
  @Column({
    default: false
  })
  top: boolean
  // 推荐
  @Column({
    default: false
  })
  recommend: boolean
  // 隐藏
  @Column({
    default: false
  })
  privacy: boolean
  // 标签
  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({
    name: 'articles_tags',
    joinColumn: {
      name: 'article_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id'
    }
  })
  tags: Tag[]
  // 分类
  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn({
    name: 'category_id'
  })
  category: Category
  // 作者
  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({
    name: 'author_id'
  })
  author: User

  static getQueryBuilder() {
    return this.createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tag')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.author', 'author')
      .select([
        'article',
        'author',
        'tag.id',
        'tag.tag_name',
        'category.id',
        'category.category_name'
      ])
  }

  static findAll(query: QueryInfo, status?: number) {
    const hasTag = Number.isNaN(parseInt(query.tag_id))
      ? '1'
      : `tag.id = ${parseInt(query.tag_id)}`
    const hasCategory = Number.isNaN(parseInt(query.category_id))
      ? '1'
      : `category.id = ${parseInt(query.category_id)}`
    const skip = query.skip ? parseInt(query.skip) : undefined
    const limit = query.limit ? parseInt(query.limit) : undefined
    return this.getQueryBuilder()
      .where('article.status = :status', { status })
      .andWhere(hasTag)
      .andWhere(hasCategory)
      .orderBy('article.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount()
  }

  static findById(id: number) {
    return this.getQueryBuilder().where('article.id = :id', { id }).getOne()
  }

  static searchArticle(query: QueryInfo) {
    const skip = query.skip ? parseInt(query.skip) : undefined
    const limit = query.limit ? parseInt(query.limit) : undefined
    return this.getQueryBuilder()
      .where('article.title like :keyword', {
        keyword: `%${query.keyword || ''}%`
      })
      .orWhere('article.description like :keyword', {
        keyword: `%${query.keyword || ''}%`
      })
      .orWhere('article.content like :keyword', {
        keyword: `%${query.keyword || ''}%`
      })
      .orderBy('article.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany()
  }
}

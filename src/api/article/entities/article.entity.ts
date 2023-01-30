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
  // 作者id
  @Column({
    default: 0
  })
  author_id: number
  // 标签
  @ManyToMany(() => Tag, (tag) => tag.tag_name)
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

  static getQueryBuilder() {
    return this.createQueryBuilder('article')
      .leftJoinAndSelect('article.tags', 'tag')
      .leftJoinAndSelect('article.category', 'category')
      .select([
        'article',
        'tag.id',
        'tag.tag_name',
        'category.id',
        'category.category_name'
      ])
  }

  static findAll(query: QueryInfo, status?: number) {
    const skip = query.skip ? parseInt(query.skip) : undefined
    const limit = query.limit ? parseInt(query.limit) : undefined
    return this.getQueryBuilder()
      .where('article.status = :status', { status })
      .orderBy('article.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany()
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

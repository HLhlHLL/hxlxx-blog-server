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

  @Column({
    default: ''
  })
  title: string

  @Column({
    type: 'text'
  })
  content: string

  @Column({
    default: ''
  })
  description: string

  @Column({
    default: ''
  })
  cover_url: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column({
    type: 'enum',
    enum: ARTICLE_TYPE,
    default: ARTICLE_TYPE.ORIGINAL
  })
  article_type: ARTICLE_TYPE

  @Column({
    default: 0
  })
  view_times: number

  @Column({
    default: true
  })
  status: boolean

  @Column({
    default: false
  })
  top: boolean

  @Column({
    default: false
  })
  recommend: boolean

  @Column({
    default: false
  })
  privacy: boolean

  @Column({
    default: 0
  })
  author_id: number

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

  static searchArticle(query: QueryInfo) {
    const skip = query.skip ? parseInt(query.skip) : undefined
    const limit = query.limit ? parseInt(query.limit) : undefined
    return this.getQueryBuilder()
      .where('article.title like :keyword', {
        keyword: `%${query.keyword || ''}%`
      })
      .orderBy('article.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany()
  }

  static findById(id: number) {
    return this.getQueryBuilder().where('article.id = :id', { id }).getOne()
  }
}

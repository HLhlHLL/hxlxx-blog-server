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

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  title: string

  @Column()
  content: string

  @Column()
  description: string

  @Column()
  cover_url: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column()
  article_type: string

  @Column()
  status: boolean

  @Column()
  top: boolean

  @Column()
  recommend: boolean

  @Column()
  privacy: boolean

  @Column()
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
        'article.id',
        'article.author_id',
        'article.title',
        'article.content',
        'article.description',
        'article.cover_url',
        'article.article_type',
        'article.status',
        'article.top',
        'article.recommend',
        'article.privacy',
        'article.created_at',
        'article.updated_at',
        'tag.id',
        'tag.tag_name',
        'category.id',
        'category.category_name'
      ])
  }

  static findAll(status?: number, query?: QueryInfo) {
    const condition = status >= 0 ? `article.status = ${status}` : ''
    const skip = query.skip ? parseInt(query.skip) : undefined
    const limit = query.limit ? parseInt(query.limit) : undefined
    return this.getQueryBuilder()
      .where(condition)
      .orderBy('article.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany()
  }

  static findById(id: number) {
    return this.getQueryBuilder().where('article.id = :id', { id }).getOne()
  }
}

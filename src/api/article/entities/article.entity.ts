import { Tag } from '../../tag/entities/tag.entity'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Category } from '../../category/entities/category.entity'

@Entity()
export class Article {
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

  @Column()
  created_at: Date

  @Column()
  updated_at: Date

  @Column()
  is_published: boolean

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
}

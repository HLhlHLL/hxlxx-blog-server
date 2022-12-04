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

  @ManyToMany(() => Tag, (tag) => tag.tag_name)
  @JoinTable()
  tags: Tag[]

  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn()
  category: Category
}

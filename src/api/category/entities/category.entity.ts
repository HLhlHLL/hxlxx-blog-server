import { Article } from '../../article/entities/article.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({
    default: ''
  })
  category_name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[]
}

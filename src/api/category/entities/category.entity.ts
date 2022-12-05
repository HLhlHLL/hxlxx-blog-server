import { Article } from '../../article/entities/article.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  category_name: string

  @Column()
  created_at: Date

  @Column()
  updated_at: Date

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[]
}

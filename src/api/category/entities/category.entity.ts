import { Article } from '../../article/entities/article.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  category_name: string

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[]
}

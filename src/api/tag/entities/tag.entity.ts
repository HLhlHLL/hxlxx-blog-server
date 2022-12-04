import { Article } from '../../article/entities/article.entity'
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  tag_name: string

  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[]
}

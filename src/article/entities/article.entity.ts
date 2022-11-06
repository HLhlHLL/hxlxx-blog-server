import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Article {
  @PrimaryGeneratedColumn('increment')
  id: string

  @Column()
  title: string

  @Column()
  content: string

  @Column()
  description: string
}

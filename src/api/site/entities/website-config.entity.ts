import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class WebsiteConfig {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({
    default: ''
  })
  author: string

  @Column({
    default: ''
  })
  author_avatar: string

  @Column({
    default: ''
  })
  author_email: string

  @Column({
    default: ''
  })
  author_motto: string

  @Column({
    default: ''
  })
  beianNumber: string

  @Column({
    default: ''
  })
  github: string

  @Column({
    default: ''
  })
  csdn: string

  @Column({
    default: ''
  })
  gitee: string

  @Column({
    default: ''
  })
  juejin: string

  @Column({
    default: ''
  })
  logo: string

  @Column({
    default: ''
  })
  notice: string

  @Column()
  webSite_created_at: Date
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Link {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  link_url: string

  @Column()
  link_name: string

  @Column()
  link_avatar: string

  @Column()
  link_intro: string

  @Column({
    default: false
  })
  status: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

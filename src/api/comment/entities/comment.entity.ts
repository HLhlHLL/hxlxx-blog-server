import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  uid: number

  @Column({
    nullable: true
  })
  topic_id: number

  @Column({
    nullable: true
  })
  pid: number

  @Column({
    nullable: true
  })
  reply_to: string

  @Column()
  content: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @Column()
  type: number
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

// 访问统计
@Entity()
export class Site {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({
    default: ''
  })
  username: string

  @Column({
    default: ''
  })
  ip: string

  @Column({
    default: ''
  })
  address: string

  @CreateDateColumn()
  created_at: Date
}

import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Menu {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({
    nullable: true
  })
  pid: number

  @Column({
    default: ''
  })
  label: string

  @Column({
    default: ''
  })
  icon: string

  @Column({
    default: ''
  })
  path: string

  @Column({
    default: true
  })
  visible: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

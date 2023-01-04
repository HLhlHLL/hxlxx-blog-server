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

  @Column()
  label: string

  @Column()
  icon: string

  @Column()
  path: string

  @Column()
  visible: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}

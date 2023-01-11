import { User } from 'src/api/user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({
    default: ''
  })
  role_name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => User, (user) => user.role)
  user: User[]

  @Column({
    type: 'simple-array'
  })
  permission_menu: number[]
}

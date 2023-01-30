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
  // 角色名称
  @Column({
    default: ''
  })
  role_name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
  // 用户列表
  @OneToMany(() => User, (user) => user.role)
  user: User[]
  // 权限菜单列表
  @Column({
    type: 'simple-array'
  })
  permission_menu: number[]
}

import { Permission } from 'src/api/permission/entities/permission.entity'
import { User } from 'src/api/user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  role_name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToOne(() => User, (user) => user.roles)
  users: User[]

  @OneToOne(() => Permission, (permission) => permission.roles)
  @JoinColumn({
    name: 'permission_id'
  })
  permissions: Permission[]
}

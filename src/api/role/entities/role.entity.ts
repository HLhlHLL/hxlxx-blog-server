import { Permission } from 'src/api/permission/entities/permission.entity'
import { User } from 'src/api/user/entities/user.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  role_name: string

  @Column()
  created_at: Date

  @Column()
  updated_at: Date

  @ManyToMany(() => User, (user) => user.roles)
  users: User[]

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id'
    }
  })
  permissions: Permission[]
}

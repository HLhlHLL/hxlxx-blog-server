import { Role } from 'src/api/role/entities/role.entity'
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  permission_value: number

  @Column()
  permission_name: string

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[]
}

import { Role } from 'src/api/role/entities/role.entity'
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  permission_name: string

  @Column()
  permission: string

  @OneToOne(() => Role, (role) => role.permissions)
  roles: Role[]
}

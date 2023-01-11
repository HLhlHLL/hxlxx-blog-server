import { Role } from 'src/api/role/entities/role.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({
    default: ''
  })
  username: string

  @Column({
    select: false
  })
  password: string

  @Column({
    default: ''
  })
  email: string

  @Column({
    default: ''
  })
  avatar_url: string

  @Column({
    default: true
  })
  status: boolean

  @Column({
    default: ''
  })
  ip: string

  @Column({
    default: ''
  })
  logged_ip: string

  @Column({
    default: null
  })
  logged_at: Date

  @Column({
    default: ''
  })
  address: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id'
  })
  role: Role
}

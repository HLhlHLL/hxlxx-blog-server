import { Article } from 'src/api/article/entities/article.entity'
import { Role } from 'src/api/role/entities/role.entity'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number
  // 用户名
  @Column({
    default: ''
  })
  username: string
  // 密码
  @Column({
    select: false
  })
  password: string
  // 邮箱
  @Column({
    default: ''
  })
  email: string
  // 头像链接
  @Column({
    default: ''
  })
  avatar_url: string
  // 状态：禁用用户
  @Column({
    default: true
  })
  status: boolean
  // IP地址
  @Column({
    default: ''
  })
  ip: string
  // 上次登录的IP
  @Column({
    default: ''
  })
  logged_ip: string
  // 登陆时间
  @Column({
    default: null
  })
  logged_at: Date
  // IP所属地
  @Column({
    default: ''
  })
  address: string
  // 创建时间
  @CreateDateColumn()
  created_at: Date
  // 更新时间
  @UpdateDateColumn()
  updated_at: Date
  // 角色
  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn({
    name: 'role_id',
    referencedColumnName: 'id'
  })
  role: Role
  // 文章
  @OneToMany(() => Article, (article) => article.author)
  articles: Article[]
}

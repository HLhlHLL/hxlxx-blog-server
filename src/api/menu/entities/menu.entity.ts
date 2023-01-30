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
  // 父级id
  @Column({
    nullable: true
  })
  pid: number
  // 菜单名称
  @Column({
    default: ''
  })
  label: string
  // 图标
  @Column({
    default: ''
  })
  icon: string
  // 路径
  @Column({
    default: ''
  })
  path: string
  // 是否显示
  @Column({
    default: true
  })
  visible: boolean
  // 创建时间
  @CreateDateColumn()
  created_at: Date
  // 更新时间
  @UpdateDateColumn()
  updated_at: Date
}

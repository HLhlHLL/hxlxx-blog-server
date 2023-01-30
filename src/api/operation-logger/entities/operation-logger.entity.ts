import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class OperationLogger {
  @PrimaryGeneratedColumn('increment')
  id: number
  // 路径
  @Column({
    default: ''
  })
  path: string
  // 请求类型
  @Column({
    default: ''
  })
  request_type: string
  // 状态码
  @Column({
    default: 0
  })
  status_code: number
  // 用户名
  @Column({
    default: ''
  })
  username: string
  // IP地址
  @Column({
    default: ''
  })
  ip: string
  // IP所在地
  @Column({
    default: ''
  })
  address: string
  // 请求参数
  @Column({
    type: 'json'
  })
  parameter: object
  // 响应体
  @Column({
    type: 'json'
  })
  response: object
  // 创建时间
  @CreateDateColumn()
  created_at: Date
}

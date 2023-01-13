import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity()
export class OperationLogger {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({
    default: ''
  })
  path: string

  @Column({
    default: ''
  })
  request_type: string

  @Column({
    default: ''
  })
  username: string

  @Column({
    default: ''
  })
  ip: string

  @Column({
    default: ''
  })
  address: string

  @Column({
    type: 'json'
  })
  parameter: object

  @UpdateDateColumn()
  updated_at: Date
}

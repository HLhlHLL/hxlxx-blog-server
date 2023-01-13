import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Site {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({
    default: 0
  })
  view_times: number
}

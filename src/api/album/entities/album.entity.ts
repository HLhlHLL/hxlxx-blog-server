import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Album {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({
    default: ''
  })
  filename: string

  @Column({
    default: ''
  })
  url: string
}

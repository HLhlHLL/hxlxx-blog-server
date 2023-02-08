import { PartialType } from '@nestjs/mapped-types'
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator'
import { CreateConfigDto } from './create-config.dto'

export class UpdateConfigDto extends PartialType(CreateConfigDto) {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  id: number

  author: string

  author_avatar: string

  author_email: string

  author_motto: string

  beianNumber: string

  github: string

  csdn: string

  gitee: string

  juejin: string

  logo: string

  notice: string

  webSite_created_at: Date
}

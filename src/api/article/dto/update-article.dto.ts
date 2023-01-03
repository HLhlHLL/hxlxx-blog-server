import { PartialType } from '@nestjs/mapped-types'
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator'
import { CreateArticleDto } from './create-article.dto'

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  id: number

  tags: any[]

  category: any

  updated_at: Date

  created_at: Date
}

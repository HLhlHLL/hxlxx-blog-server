import { PartialType } from '@nestjs/mapped-types'
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator'
import { ARTICLE_TYPE } from '../entities/article.entity'
import { CreateArticleDto } from './create-article.dto'

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  id: number

  article_type: ARTICLE_TYPE

  tags: any[]

  category: any

  updated_at: Date

  created_at: Date
}

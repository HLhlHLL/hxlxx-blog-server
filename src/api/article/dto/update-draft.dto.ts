import { PartialType } from '@nestjs/mapped-types'
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { ARTICLE_TYPE } from '../entities/article.entity'
import { CreateDraftDto } from './create-draft.dto'

export class UpdateDraftDto extends PartialType(CreateDraftDto) {
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  title: string

  article_type: ARTICLE_TYPE

  tags: any[]

  category: any

  updated_at: Date

  created_at: Date
}

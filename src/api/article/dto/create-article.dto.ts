import {
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator'
import { ARTICLE_TYPE } from '../entities/article.entity'

export class CreateArticleDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  content: string

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  description: string

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  article_type: ARTICLE_TYPE

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  top: boolean

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  recommend: boolean

  @IsDefined()
  @IsNotEmpty()
  @IsBoolean()
  privacy: boolean

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  cover_url: string

  @IsDefined()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false
    },
    { each: true }
  )
  tag_ids: number[]

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  category_id: number

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  author_id: number
}

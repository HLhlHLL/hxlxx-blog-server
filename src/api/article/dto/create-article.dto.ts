import {
  ArrayNotEmpty,
  ArrayUnique,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator'

export class CreateArticleDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  id?: number

  @IsDefined()
  @IsNotEmpty()
  title: string

  @IsDefined()
  @IsNotEmpty()
  content: string

  @IsDefined()
  @IsNotEmpty()
  description: string

  @IsOptional()
  @IsString()
  @IsUrl()
  cover_url?: string

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

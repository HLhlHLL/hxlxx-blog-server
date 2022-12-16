import {
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class CreateDraftDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  content: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  article_type: string

  @IsOptional()
  @IsBoolean()
  status: boolean

  @IsOptional()
  @IsBoolean()
  top: boolean

  @IsOptional()
  @IsBoolean()
  recommend: boolean

  @IsOptional()
  @IsBoolean()
  privacy: boolean

  @IsOptional()
  @IsString()
  cover_url: string

  @IsOptional()
  @ArrayUnique()
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false
    },
    { each: true }
  )
  tag_ids: number[]

  @IsOptional()
  @IsNumber()
  category_id: number

  @IsOptional()
  @IsNumber()
  author_id: number
}

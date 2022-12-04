import {
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsNotEmpty,
  IsNumber
} from 'class-validator'

export class CreateArticleDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  content: string

  @IsNotEmpty()
  description: string

  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false
    },
    { each: true }
  )
  tag_ids: number[]

  @IsNotEmpty()
  @IsNumber()
  category_id: number
}

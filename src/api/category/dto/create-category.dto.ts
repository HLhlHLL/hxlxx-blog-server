import { IsString, Length } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @Length(1, 15)
  category_name: string
}

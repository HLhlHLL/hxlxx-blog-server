import { IsDefined, IsString, Length } from 'class-validator'

export class CreateCategoryDto {
  @IsDefined()
  @IsString()
  @Length(1, 15)
  category_name: string
}

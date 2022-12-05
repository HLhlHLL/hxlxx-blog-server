import { IsDefined, IsString, Length } from 'class-validator'

export class CreateTagDto {
  @IsDefined()
  @IsString()
  @Length(1, 15)
  tag_name: string
}

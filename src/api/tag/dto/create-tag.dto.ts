import { IsString, Length } from 'class-validator'

export class CreateTagDto {
  @IsString()
  @Length(1, 15)
  tag_name: string
}

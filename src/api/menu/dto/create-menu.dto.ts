import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class CreateMenuDto {
  @IsOptional()
  @IsNumber()
  pid: number

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  label: string

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  icon: string

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  path: string
}

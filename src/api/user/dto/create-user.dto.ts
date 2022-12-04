import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  Length,
  IsNumber
} from 'class-validator'

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  id?: number

  @IsNotEmpty()
  @Length(5, 10)
  @IsAlphanumeric()
  username: string

  @IsNotEmpty()
  @Length(6, 16)
  password: string
}

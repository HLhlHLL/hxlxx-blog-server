import {
  IsAlphanumeric,
  IsNotEmpty,
  IsOptional,
  Length,
  IsNumber,
  IsEmail,
  IsDefined
} from 'class-validator'

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  id?: number

  @IsDefined()
  @IsNotEmpty()
  @Length(5, 10)
  @IsAlphanumeric()
  username: string

  @IsDefined()
  @IsNotEmpty()
  @Length(6, 16)
  password: string

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsDefined()
  @IsNotEmpty()
  @Length(6, 6)
  code: string
}

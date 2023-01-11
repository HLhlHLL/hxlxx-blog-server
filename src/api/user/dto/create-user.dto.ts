import {
  IsNotEmpty,
  IsOptional,
  Length,
  IsNumber,
  IsEmail,
  IsDefined,
  IsUrl,
  IsString,
  IsAscii
} from 'class-validator'

export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  id?: number

  @IsDefined()
  @IsNotEmpty()
  @Length(5, 10)
  username: string

  @IsDefined()
  @IsNotEmpty()
  @Length(6, 16)
  @IsAscii()
  password: string

  @IsOptional()
  @IsString()
  @IsUrl()
  avatar_url?: string

  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsDefined()
  @IsNotEmpty()
  @Length(6, 6)
  code: string

  status: boolean
}

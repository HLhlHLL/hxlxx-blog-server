import { PartialType } from '@nestjs/mapped-types'
import {
  IsAscii,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  Length
} from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsDefined()
  @IsNotEmpty()
  @Length(5, 10)
  username: string

  @IsDefined()
  @IsNotEmpty()
  @Length(6, 16)
  @IsAscii()
  password: string

  auth_token?: string
}

import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @Length(5, 10)
  @IsAlphanumeric()
  username: string

  @IsNotEmpty()
  @Length(6, 16)
  password: string
}

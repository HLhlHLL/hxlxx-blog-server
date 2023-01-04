import { IsDefined, IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateRoleDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  role_name: string

  @IsDefined()
  @IsNotEmpty()
  permissions: string
}

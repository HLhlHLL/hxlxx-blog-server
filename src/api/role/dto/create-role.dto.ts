import {
  ArrayUnique,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length
} from 'class-validator'

export class CreateRoleDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  role_name: string

  @IsDefined()
  @IsArray()
  @ArrayUnique()
  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  permission_menu: number[]
}

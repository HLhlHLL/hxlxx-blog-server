import {
  ArrayNotEmpty,
  ArrayUnique,
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
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false
    },
    { each: true }
  )
  permission_ids: number[]
}

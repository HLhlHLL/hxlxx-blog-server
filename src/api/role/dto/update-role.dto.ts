import { PartialType } from '@nestjs/mapped-types'
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator'
import { CreateRoleDto } from './create-role.dto'

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  id: number

  created_at: Date

  updated_at: Date
}

import { PartialType } from '@nestjs/mapped-types'
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator'
import { CreateMenuDto } from './create-menu.dto'

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  id: number
}

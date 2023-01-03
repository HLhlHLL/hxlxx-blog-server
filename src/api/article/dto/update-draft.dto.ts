import { PartialType } from '@nestjs/mapped-types'
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { CreateDraftDto } from './create-draft.dto'

export class UpdateDraftDto extends PartialType(CreateDraftDto) {
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  title: string

  tags: any[]

  category: any

  updated_at: Date

  created_at: Date
}

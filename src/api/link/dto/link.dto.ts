import { IsUrl } from 'class-validator'

export class LinkDto {
  id?: number

  @IsUrl()
  link_url: string

  link_name: string

  @IsUrl()
  link_avatar: string

  link_intro: string

  status: boolean

  created_at: Date

  updated_at: Date
}

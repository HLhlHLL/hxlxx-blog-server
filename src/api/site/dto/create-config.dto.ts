import { IsOptional, IsString } from 'class-validator'

export class CreateConfigDto {
  @IsOptional()
  @IsString()
  author: string

  @IsOptional()
  @IsString()
  author_avatar: string

  @IsOptional()
  @IsString()
  author_email: string

  @IsOptional()
  @IsString()
  author_motto: string

  @IsOptional()
  @IsString()
  beianNumber: string

  @IsOptional()
  @IsString()
  github: string

  @IsOptional()
  @IsString()
  csdn: string

  @IsOptional()
  @IsString()
  gitee: string

  @IsOptional()
  @IsString()
  juejin: string

  @IsOptional()
  @IsString()
  logo: string

  @IsOptional()
  @IsString()
  notice: string

  @IsOptional()
  webSite_created_at: Date
}

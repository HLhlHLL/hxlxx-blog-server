import { PipeTransform } from '@nestjs/common'
import { validate } from 'class-validator'
import { CreateArticleDto } from 'src/api/article/dto/create-article.dto'
import { UpdateArticleDto } from 'src/api/article/dto/update-article.dto'
import { throwValidateException } from '../utils'

export class ValidateArticlePipe implements PipeTransform {
  constructor(private readonly type = 0) {}

  async transform(value: any) {
    value.id && (value.id = parseInt(value.id))
    value.author_id = parseInt(value.author_id)
    value.tag_ids = Array.isArray(value.tag_ids)
      ? value.tag_ids.map((id) => parseInt(id))
      : [value.tag_ids].map((id) => parseInt(id))
    value.category_id = parseInt(value.category_id)

    const { id, title, content, description, author_id, tag_ids, category_id } =
      value

    const articleDto = this.type
      ? new UpdateArticleDto()
      : new CreateArticleDto()

    this.type && (articleDto.id = id)
    articleDto.title = title
    articleDto.content = content
    articleDto.description = description
    articleDto.author_id = author_id
    articleDto.tag_ids = tag_ids
    articleDto.category_id = category_id

    const errors = await validate(articleDto)
    if (errors.length) {
      throwValidateException(errors)
    }
    return value
  }
}

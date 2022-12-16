import { PipeTransform } from '@nestjs/common'
import { validate } from 'class-validator'
import { CreateArticleDto } from 'src/api/article/dto/create-article.dto'
import { UpdateArticleDto } from 'src/api/article/dto/update-article.dto'
import { throwValidateException } from '../utils'

export class ValidateArticlePipe implements PipeTransform {
  constructor(private readonly type = 0) {}

  async transform(value: any) {
    value.id && (value.id = parseInt(value.id))
    value.status = parseInt(value.status)
    value.top = parseInt(value.top)
    value.recommend = parseInt(value.recommend)
    value.privacy = parseInt(value.privacy)
    value.author_id = parseInt(value.author_id)
    value.tag_ids = Array.isArray(value.tag_ids)
      ? value.tag_ids.map((id) => parseInt(id))
      : [value.tag_ids].map((id) => parseInt(id))
    value.category_id = parseInt(value.category_id)

    const {
      id,
      title,
      content,
      description,
      author_id,
      tag_ids,
      category_id,
      status,
      article_type,
      top,
      recommend,
      privacy
    } = value

    const articleDto = this.type
      ? new UpdateArticleDto()
      : new CreateArticleDto()

    // this.type && (articleDto.id = id)
    articleDto.title = title
    articleDto.status = status
    if (articleDto.status) {
      // 状态不为草稿时才验证下列字段
      articleDto.content = content
      articleDto.author_id = author_id
      articleDto.description = description
      articleDto.tag_ids = tag_ids
      articleDto.category_id = category_id
      articleDto.article_type = article_type
      articleDto.top = top
      articleDto.recommend = recommend
      articleDto.privacy = privacy
    }

    const errors = await validate(articleDto)
    if (errors.length) {
      throwValidateException(errors)
    }
    return value
  }
}

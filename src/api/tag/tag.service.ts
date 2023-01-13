import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInfo } from 'src/libs/types'
import { throwHttpException } from 'src/libs/utils'
import { Repository } from 'typeorm'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { Tag } from './entities/tag.entity'

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRep: Repository<Tag>
  ) {}

  async create({ tag_name }: CreateTagDto) {
    const isExist = await this.tagRep.findOneBy({ tag_name })
    if (isExist) {
      throwHttpException(
        '文章标签已经存在，请勿重复添加！',
        HttpStatus.BAD_REQUEST
      )
    }
    const tag = new Tag()
    tag.tag_name = tag_name
    const res = this.tagRep.save(tag)
    return res
  }

  async findAll(query?: QueryInfo) {
    const skip = query.skip ? parseInt(query.skip) : undefined
    const limit = query.limit ? parseInt(query.limit) : undefined
    const res = await this.tagRep.find({
      skip,
      take: limit
    })
    const count = await this.tagRep.count()
    return { res, count }
  }

  async findById(id: number) {
    const res = await this.tagRep.findOneBy({ id })
    return res
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const { affected } = await this.tagRep.update(id, updateTagDto)
    if (affected > 0) {
      return '更新文章标签成功！'
    } else {
      throwHttpException('参数错误，更新文章标签失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: number) {
    const { affected } = await this.tagRep.delete(id)
    if (affected > 0) {
      return '删除文章标签成功！'
    } else {
      throwHttpException('参数错误，删除文章标签失败！', HttpStatus.BAD_REQUEST)
    }
  }
}

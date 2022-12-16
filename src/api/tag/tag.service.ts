import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { QueryInfo } from 'src/libs/types'
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
      throw new HttpException(
        'The tag is already exist',
        HttpStatus.BAD_REQUEST
      )
    }
    const tag = new Tag()
    tag.tag_name = tag_name
    tag.created_at = new Date()
    tag.updated_at = tag.created_at
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

  async update(id: number, { tag_name }: UpdateTagDto) {
    const { affected } = await this.tagRep.update(id, {
      tag_name,
      updated_at: new Date()
    })
    if (affected > 0) {
      return 'update tag successfully'
    } else {
      throw new HttpException(
        'Update failed, please check the parameter',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async remove(id: number) {
    await this.tagRep.delete(id)
    return 'delete tag successfully'
  }
}

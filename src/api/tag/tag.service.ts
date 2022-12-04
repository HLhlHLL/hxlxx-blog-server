import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
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
    const tag = new Tag()
    tag.tag_name = tag_name
    const res = this.tagRep.save(tag)
    return res
  }

  async findAll() {
    const [res, count] = await this.tagRep.findAndCount()
    return { res, count }
  }

  async findById(id: number) {
    const res = await this.tagRep.findOneBy({ id })
    return res
  }

  async update(id: number, { tag_name }: UpdateTagDto) {
    await this.tagRep.update(id, { tag_name })
    return 'update tag successfully'
  }

  async remove(id: number) {
    await this.tagRep.delete(id)
    return 'delete tag successfully'
  }
}

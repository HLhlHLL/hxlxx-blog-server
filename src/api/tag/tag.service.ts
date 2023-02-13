import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { QueryInfo } from 'src/libs/types'
import { throwHttpException } from 'src/libs/utils'
import { EntityManager, Repository } from 'typeorm'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { Tag } from './entities/tag.entity'

@Injectable()
export class TagService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
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

  async findTagAndCount() {
    const res = await this.tagRep
      .createQueryBuilder('tag')
      .innerJoinAndSelect('tag.articles', 'article')
      .select(['tag_name', 'tag.id id'])
      .where('article.status = :status', { status: true })
      .addSelect('COUNT(tag.id)', 'count')
      .groupBy('tag.id')
      .getRawMany()
    return res
  }

  async findTagTop10() {
    const res = await this.tagRep
      .createQueryBuilder('tag')
      .innerJoinAndSelect('tag.articles', 'article')
      .select(['tag_name', 'tag.id id'])
      .where('article.status = :status', { status: true })
      .addSelect('COUNT(tag.id)', 'count')
      .groupBy('tag.id')
      .limit(10)
      .getRawMany()
    return res
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

  async removeById(id: number) {
    const { affected } = await this.tagRep.delete(id)
    if (affected > 0) {
      return '删除文章标签成功！'
    } else {
      throwHttpException('参数错误，删除文章标签失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async removeByIds(ids: number[]) {
    await this.manager.transaction(async (_manager) => {
      for (const id of ids) {
        await _manager.delete(Tag, id)
      }
    })
    return '批量删除文章标签成功！'
  }
}

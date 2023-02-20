import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { throwHttpException } from 'src/libs/utils'
import { EntityManager, Repository } from 'typeorm'
import { LinkDto } from './dto/link.dto'
import { Link } from './entities/link.entity'

@Injectable()
export class LinkService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectRepository(Link) private readonly linkRep: Repository<Link>
  ) {}

  async create(linkDto: LinkDto) {
    const link = new Link()
    Object.assign(link, linkDto)
    const res = await this.linkRep.save(link)
    return res
  }

  async find() {
    const [res, count] = await this.linkRep.findAndCount({
      where: { status: true },
      order: { created_at: 'DESC' }
    })
    return { res, count }
  }

  async findAll(skip: number, limit: number) {
    const count = await this.linkRep.count()
    const res = await this.linkRep.find({
      order: { created_at: 'DESC' },
      skip,
      take: limit
    })
    return { res, count }
  }

  async update(link: LinkDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { created_at, updated_at, ...rest } = link
    const { affected } = await this.linkRep.update(link.id, rest)
    if (affected > 0) {
      return '更新友链成功！'
    } else {
      throwHttpException('参数错误，更新友链失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async removeById(id: number) {
    const { affected } = await this.linkRep.delete(id)
    if (affected > 0) {
      return '删除友链成功！'
    } else {
      throwHttpException('参数错误，删除友链失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async removeByIds(ids: number[]) {
    await this.manager.transaction(async (_manager) => {
      for (const id of ids) {
        await _manager.delete(Link, id)
      }
    })
    return '批量删除友链成功！'
  }
}

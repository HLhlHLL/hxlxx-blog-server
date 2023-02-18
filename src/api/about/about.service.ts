import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { throwHttpException } from 'src/libs/utils'
import { Repository } from 'typeorm'
import { About } from './entities/about.entity'

@Injectable()
export class AboutService {
  constructor(
    @InjectRepository(About) private readonly aboutRep: Repository<About>
  ) {}

  async create(content: string) {
    const about = new About()
    about.content = content
    await this.aboutRep.save(about)
    return '发布说说成功'
  }

  async findOne() {
    const res = await this.aboutRep.findOneBy({ id: 1 })
    return res
  }

  async update(id: number, content: string) {
    const { affected } = await this.aboutRep.update(id, { content })
    if (affected > 0) {
      return '更信息成功！'
    } else {
      throwHttpException('参数错误，更新信息失败！', HttpStatus.BAD_REQUEST)
    }
  }
}

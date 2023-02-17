import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { throwHttpException } from 'src/libs/utils'
import { Repository } from 'typeorm'
import { User } from '../user/entities/user.entity'
import { CreateTalkDto } from './dto/create-talk.dto'
import { UpdateTalkDto } from './dto/update-talk.dto'
import { Talk } from './entities/talk.entity'

@Injectable()
export class TalkService {
  constructor(
    @InjectRepository(Talk) private readonly talkRep: Repository<Talk>
  ) {}

  async create(createTalkDto: CreateTalkDto) {
    const talk = new Talk()
    Object.assign(talk, createTalkDto)
    const res = await this.talkRep.save(talk)
    return res
  }

  async findAll(skip: number, limit: number) {
    const [res, count] = await this.talkRep
      .createQueryBuilder('talk')
      .leftJoinAndMapOne('talk.user', User, 'user', 'user.id = talk.uid')
      .skip(skip)
      .take(limit)
      .getManyAndCount()
    return { res, count }
  }

  async findOneById(id: number) {
    const res = await this.talkRep.findOneBy({ id })
    return res
  }

  async update({ id, ...rest }: UpdateTalkDto) {
    const { affected } = await this.talkRep.update(id, rest)
    if (affected > 0) {
      return '更新说说成功！'
    } else {
      throwHttpException('参数错误，更新说说失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async removeById(id: number) {
    const { affected } = await this.talkRep.delete(id)
    if (affected > 0) {
      return '删除评论成功！'
    } else {
      throwHttpException('参数错误，删除评论失败！', HttpStatus.BAD_REQUEST)
    }
  }
}

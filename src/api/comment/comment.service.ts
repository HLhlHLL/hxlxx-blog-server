import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { throwHttpException } from 'src/libs/utils'
import { EntityManager, Repository } from 'typeorm'
import { Article } from '../article/entities/article.entity'
import { Talk } from '../talk/entities/talk.entity'
import { User } from '../user/entities/user.entity'
import { CreateCommentDto } from './dto/create-comment.dto'
import { Comment } from './entities/comment.entity'

@Injectable()
export class CommentService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectRepository(Comment) private readonly commentRep: Repository<Comment>
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = new Comment()
    Object.assign(comment, createCommentDto)
    let res = await this.manager.save(Comment, comment)
    // 当类型为说说评论时需要更新 talk.comment_count
    if (comment.type === 3) {
      const talk = await this.manager.findOne(Talk, {
        where: { id: res.topic_id }
      })
      await this.manager.update(Talk, talk.id, {
        comment_count: talk.comment_count + 1
      })
    }
    return res
  }

  async findComments(
    type: number,
    skip: number,
    limit: number,
    topic_id?: number
  ) {
    const res = []
    const [parent, count] = await this.commentRep
      .createQueryBuilder('comment')
      .leftJoinAndMapOne('comment.user', User, 'user', 'user.id = comment.uid')
      .where('comment.type = :type and comment.pid is null', { type })
      .andWhere(`${topic_id ? `comment.topic_id = ${topic_id}` : '1'}`)
      .orderBy({ 'comment.created_at': 'DESC' })
      .skip(skip)
      .take(limit)
      .getManyAndCount()
    for (let i = 0; i < parent.length; i++) {
      res.push({
        ...parent[i],
        reply: await this.commentRep
          .createQueryBuilder('comment')
          .leftJoinAndMapOne(
            'comment.user',
            User,
            'user',
            'user.id = comment.uid'
          )
          .where('comment.pid = :id', { id: parent[i].id })
          .getMany()
      })
    }
    return { res, count }
  }

  async findAll(skip: number, limit: number) {
    const [res, count] = await this.commentRep
      .createQueryBuilder('comment')
      .leftJoinAndMapOne('comment.user', User, 'user', 'user.id = comment.uid')
      .orderBy({ 'comment.created_at': 'DESC' })
      .skip(skip)
      .take(limit)
      .getManyAndCount()
    for (let i = 0; i < res.length; i++) {
      const tmp = res[i] as any
      if (tmp.type === 2) {
        const article = await this.manager.findOneBy(Article, {
          id: tmp.topic_id
        })
        tmp.article_title = article.title
      }
    }
    return { res, count }
  }

  async findRecently() {
    const res = await this.commentRep
      .createQueryBuilder('comment')
      .leftJoinAndMapOne('comment.user', User, 'user', 'user.id = comment.uid')
      .where('comment.pid is null')
      .orderBy({ 'comment.created_at': 'DESC' })
      .limit(5)
      .getMany()
    return res
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`
  }

  async removeById(id: number) {
    const { affected } = await this.commentRep.delete(id)
    if (affected > 0) {
      return '删除评论成功！'
    } else {
      throwHttpException('参数错误，删除评论失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async removeByIds(ids: number[]) {
    await this.manager.transaction(async (_manager) => {
      for (const id of ids) {
        await _manager.delete(Comment, id)
      }
    })
    return '批量删除评论成功！'
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { compareSync, hashSync } from 'bcryptjs'
import { Role } from '../role/entities/role.entity'
import config from 'env.config'
import { throwHttpException } from 'src/libs/utils'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRep: Repository<User>,
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  async register(
    { username, password, email, code }: CreateUserDto,
    emailCode: string
  ) {
    const isExist = await this.userRep.findOneBy({ username })
    if (isExist) {
      throwHttpException('用户名已经存在！', HttpStatus.BAD_REQUEST)
    }
    if (emailCode !== code) {
      throwHttpException('验证码错误！', HttpStatus.BAD_REQUEST)
    }
    const user = new User()
    const role = await this.manager.findOneBy(Role, { role_name: 'user' })
    user.role = role
    user.username = username
    user.email = email
    user.avatar_url = config.DEFAULT_AVATAR_URL
    user.password = hashSync(password, 10)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...res } = await this.userRep.save(user)
    return res
  }

  async findAll() {
    const [res, count] = await this.userRep
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .select(['user', 'role.id', 'role.role_name'])
      .getManyAndCount()
    return { res, count }
  }

  async findById(id: number) {
    const res = await this.userRep
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.role', 'role')
      .select(['user', 'role.role_name'])
      .where({ id })
      .getOne()
    return res
  }

  async findByUserName(username: string) {
    const res = await this.userRep.findOneBy({ username })
    return res
  }

  async updateUserRole({ id, role_id }) {
    const role = await this.manager.findOneBy(Role, { id: role_id })
    const user = await this.userRep.findOneBy({ id })
    user.role = role
    await this.userRep.save(user)
    return '更新用户角色成功！'
  }

  async updateUserStatus({ id, status }) {
    const { affected } = await this.userRep.update(id, { status })
    if (affected > 0) {
      return '更新用户状态成功！'
    } else {
      throw new HttpException(
        '参数错误，更新用户状态失败！',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async resetUsername({ id, username }) {
    const { affected } = await this.userRep.update(id, { username })
    if (affected > 0) {
      return '更新用户名成功！'
    } else {
      throwHttpException('参数错误，更新用户名失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async resetPassword({ id, oldPwd, newPwd }) {
    const user = await this.manager
      .createQueryBuilder(User, 'user')
      .addSelect(['user.password'])
      .where('user.id = :id', { id })
      .getOne()
    if (!user) {
      throwHttpException('用户不存在！', HttpStatus.BAD_REQUEST)
    }
    const valid = compareSync(oldPwd, user.password)
    if (valid) {
      const password = hashSync(newPwd, 10)
      const { affected } = await this.userRep.update(user.id, { password })
      if (affected > 0) {
        return '重置密码成功！'
      } else {
        throwHttpException('参数错误，重置密码失败！', HttpStatus.BAD_REQUEST)
      }
    } else {
      throwHttpException('密码错误，请重试！', HttpStatus.BAD_REQUEST)
    }
  }

  async resetAvatar({ id, avatar_url }) {
    const { affected } = await this.userRep.update(id, { avatar_url })
    if (affected > 0) {
      return 'Update avatar successfully'
    } else {
      throwHttpException(
        'Update avatar failed, please check the parameter',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async remove(id: string) {
    await this.userRep.delete(id)
    return 'Delete user successfully'
  }
}

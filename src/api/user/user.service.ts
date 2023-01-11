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
    const isExistUser = await this.userRep.findOneBy({ username })
    if (isExistUser) {
      return {
        message: 'The username is already exist!!'
      }
    }
    if (emailCode !== code) {
      throwHttpException('The code is wrong!!', HttpStatus.BAD_REQUEST)
    }
    const user = new User()
    const role = await this.manager.findOneBy(Role, { role_name: 'user' })
    user.role = role
    user.username = username
    user.email = email
    user.avatar_url = config.DEFAULT_AVATAR_URL
    password = hashSync(password, 10)
    user.password = password
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
    return 'Update user successfully'
  }

  async updateUserStatus({ id, status }) {
    const { affected } = await this.userRep.update(id, { status })
    if (affected > 0) {
      return 'Update user status successfully'
    } else {
      throw new HttpException(
        'Update failed, please check the parameter',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async resetUsername({ id, username }) {
    const { affected } = await this.userRep.update(id, { username })
    if (affected > 0) {
      return 'Update username successfully'
    } else {
      throwHttpException(
        'Update username failed, please check the parameter',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async authentication({ id, password }) {
    const user = await this.userRep.findOneBy({ id })
    if (!user) {
      throwHttpException(
        'User is not exist, please check the parameter',
        HttpStatus.BAD_REQUEST
      )
    }
    const auth = compareSync(password, user.password)
    if (auth) {
      const token = Math.random().toString().slice(-6)
      global.TEMP_TOKEN = token
      return { token }
    } else {
      throwHttpException(
        'Password is wrong, please try again',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async resetPassword(user) {
    if (global.TEMP_TOKEN === user.auth_token) {
      const password = hashSync(user.password, 10)
      const { affected } = await this.userRep.update(user.id, { password })
      if (affected > 0) {
        return 'update user successfully'
      } else {
        throwHttpException(
          'Reset password failed, please check the parameter',
          HttpStatus.BAD_REQUEST
        )
      }
    } else {
      throwHttpException(
        'Authentication failed, please get the authentication token first',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async resetAvatar(id, avatar_url) {
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

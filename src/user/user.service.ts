import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import * as jwt from 'jsonwebtoken'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = new User()
    const { username, password } = createUserDto
    const isExistUser = await this.user.find({
      where: {
        username
      }
    })
    if (isExistUser.length) {
      return {
        message: '用户名已存在！！'
      }
    }
    user.username = username
    user.password = password
    const result = await this.user.save(user)
    return {
      id: result.id,
      username: result.username
    }
  }

  async login(user: { username: string; password: string }) {
    const { username, password } = user
    const token = jwt.sign(
      {
        username,
        password
      },
      'hxlxx123',
      {
        expiresIn: 10
      }
    )
    const findUser = await this.user.find({
      where: {
        username,
        password
      }
    })
    if (findUser.length) {
      return {
        token,
        message: '登陆成功！！'
      }
    } else {
      return {
        token: '',
        message: '用户不存在！！'
      }
    }
  }

  findAll() {
    return `This action returns all user`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}

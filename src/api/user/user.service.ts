import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRep: Repository<User>
  ) {}

  async register({ username, password }: CreateUserDto) {
    const user = new User()
    const isExistUser = await this.userRep.find({
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
    password = bcrypt.hashSync(password, 10)
    user.password = password
    const { password: _, ...res } = await this.userRep.save(user)
    return res
  }

  async findAll() {
    const [res, count] = await this.userRep.findAndCount()
    return { res, count }
  }

  async findById(id: number) {
    const res = await this.userRep.findOneBy({ id })
    return res
  }

  async findByUserName(username: string) {
    const res = await this.userRep.findOneBy({ username })
    return res
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userRep.update(id, updateUserDto)
    return 'update user successfully'
  }

  async remove(id: string) {
    await this.userRep.delete(id)
    return 'delete user successfully'
  }
}

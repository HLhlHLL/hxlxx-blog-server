import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcryptjs'
import { Role } from '../role/entities/role.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRep: Repository<User>,
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  async register({ username, password, email, code }: CreateUserDto) {
    const isExistUser = await this.userRep.findOneBy({ username })
    if (isExistUser) {
      return {
        message: 'The username is already exist!!'
      }
    }
    if (global.EMAIL_CODE !== code) {
      throw new HttpException('The code is wrong!!', HttpStatus.BAD_REQUEST)
    }
    const user = new User()
    const role = await this.manager.findOneBy(Role, { role_name: 'user' })
    user.roles = [role]
    user.username = username
    user.email = email
    user.created_at = new Date()
    user.updated_at = user.created_at
    password = bcrypt.hashSync(password, 10)
    user.password = password
    const { password: _, ...res } = await this.userRep.save(user)
    return res
  }

  async findAll() {
    const [res, count] = await this.userRep
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.roles', 'role')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'role.id',
        'role.role_name'
      ])
      .getManyAndCount()
    return { res, count }
  }

  async findById(id: number) {
    const res = await this.userRep
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.roles', 'role')
      .select([
        'user.id',
        'user.username',
        'user.email',
        'role.id',
        'role.role_name'
      ])
      .where({ id })
      .getOne()
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

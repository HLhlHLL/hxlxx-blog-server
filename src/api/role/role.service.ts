import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { throwHttpException } from 'src/libs/utils'
import { EntityManager, Repository } from 'typeorm'
import { Menu } from '../menu/entities/menu.entity'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Role } from './entities/role.entity'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRep: Repository<Role>,
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  async create({ role_name }: CreateRoleDto) {
    const isExist = await this.roleRep.findOneBy({ role_name })
    if (isExist) {
      throwHttpException('The role is already exist', HttpStatus.BAD_REQUEST)
    }
    const role = new Role()
    role.role_name = role_name
    const res = await this.roleRep.save(role)
    return res
  }

  async findAll() {
    const res = await this.roleRep.find()
    return res
  }

  async getMenu() {
    const res = await this.manager
      .createQueryBuilder(Menu, 'menu')
      .select(['menu.id', 'menu.pid', 'menu.label'])
      .getMany()
    return res
  }

  async findById(id: number) {
    const res = await this.roleRep.findOneBy({ id })
    return res
  }

  async update(updateRoleDto: UpdateRoleDto) {
    const { id, created_at, updated_at, ...role } = updateRoleDto
    const { affected } = await this.roleRep.update(id, role)
    if (affected > 0) {
      return 'update role successfully'
    } else {
      throwHttpException(
        'Update failed, please check the parameter',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async remove(id: number) {
    await this.roleRep.delete(id)
    return 'delete role successfully'
  }
}

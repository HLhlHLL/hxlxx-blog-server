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

  async create({ role_name, permission_menu }: CreateRoleDto) {
    const isExist = await this.roleRep.findOneBy({ role_name })
    if (isExist) {
      throwHttpException('角色已经存在，请勿重复添加！', HttpStatus.BAD_REQUEST)
    }
    const role = new Role()
    role.role_name = role_name
    role.permission_menu = permission_menu
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, ...role } = updateRoleDto
    const { affected } = await this.roleRep.update(id, role)
    if (affected > 0) {
      return '更新角色成功！'
    } else {
      throwHttpException('参数错误，更新角色失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: number) {
    const { affected } = await this.roleRep.delete(id)
    if (affected > 0) {
      return '删除角色成功！'
    } else {
      throwHttpException('参数错误，删除角色失败！', HttpStatus.BAD_REQUEST)
    }
  }
}

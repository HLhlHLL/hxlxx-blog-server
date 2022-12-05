import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { Permission } from '../permission/entities/permission.entity'
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
      throw new HttpException(
        'The role is already exist',
        HttpStatus.BAD_REQUEST
      )
    }
    const role = new Role()
    role.role_name = role_name
    role.created_at = new Date()
    role.updated_at = role.created_at
    const res = await this.roleRep.save(role)
    return res
  }

  async findAll() {
    const res = await this.roleRep.find()
    return res
  }

  async findById(id: number) {
    const res = await this.roleRep.findOneBy({ id })
    return res
  }

  async update(id: number, { role_name, permission_ids }: UpdateRoleDto) {
    const { affected } = await this.roleRep.update(id, { role_name })
    if (affected > 0) {
      const permissions = []
      if (permission_ids.length) {
        for (const id of permission_ids) {
          const permission = await this.manager.findOneBy(Permission, { id })
          permission && permissions.push(permission)
        }
      }
      const role = await this.roleRep.findOneBy({ id })
      permissions.length && (role.permissions = permissions)
      await this.roleRep.save(role)
      return 'update role successfully'
    } else {
      throw new HttpException(
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

import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UpdateVisible } from 'src/libs/types'
import { throwHttpException } from 'src/libs/utils'
import { Repository } from 'typeorm'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { Menu } from './entities/menu.entity'

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRep: Repository<Menu>
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    const isExist = await this.menuRep.findOneBy({ label: createMenuDto.label })
    if (isExist) {
      throwHttpException('菜单已经存在，请勿重复添加！', HttpStatus.BAD_REQUEST)
    }
    const menu = new Menu()
    Object.assign(menu, createMenuDto)
    const res = await this.menuRep.save(menu)
    return res
  }

  async findAll() {
    const res = await this.menuRep.find()
    return res
  }

  async findById(id: number) {
    const res = await this.menuRep.findOneBy({ id })
    return res
  }

  async update(updateMenuDto: UpdateMenuDto) {
    const { affected } = await this.menuRep.update(
      updateMenuDto.id,
      updateMenuDto
    )
    if (affected > 0) {
      return '更新菜单成功！'
    } else {
      throwHttpException('参数错误，更新菜单失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async updateVisible({ id, visible }: UpdateVisible) {
    const { affected } = await this.menuRep
      .createQueryBuilder()
      .update()
      .set({ visible })
      .where('id = :id', { id })
      .execute()
    if (affected > 0) {
      return '更新菜单显示状态成功！'
    } else {
      throwHttpException('参数错误，更新菜单状态失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async remove(id: number) {
    const { affected } = await this.menuRep.delete(id)
    if (affected > 0) {
      return '删除菜单成功！'
    } else {
      throwHttpException('参数错误，删除菜单失败！', HttpStatus.BAD_REQUEST)
    }
  }
}

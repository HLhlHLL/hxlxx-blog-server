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
      return 'update menu successfully'
    } else {
      throwHttpException(
        'Update failed, please check the parameter',
        HttpStatus.BAD_REQUEST
      )
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
      return 'Update menu status successfully'
    } else {
      throwHttpException(
        'Update failed, please check the parameter',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  async remove(id: number) {
    await this.menuRep.delete(id)
    return 'delete menu successfully'
  }
}

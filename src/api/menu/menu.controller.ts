import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe
} from '@nestjs/common'
import { MenuService } from './menu.service'
import { CreateMenuDto } from './dto/create-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { UpdateVisible } from 'src/libs/types'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { MenuGuard } from 'src/libs/guard/menu.guard'

@Controller('menu')
@Menu(11)
@UseGuards(JwtAuthGuard)
@UseGuards(MenuGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}
  // 新建菜单
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto)
  }
  // 获取所有菜单
  @Get()
  @Menu(0)
  findAll() {
    return this.menuService.findAll()
  }
  // 获取某一个菜单
  @Get(':id')
  @Menu(0)
  findById(@Param('id', new ParseIntPipe()) id: number) {
    return this.menuService.findById(id)
  }
  // 更新某一个菜单
  @Patch()
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto)
  }
  // 更新菜单显示状态
  @Patch('/visible')
  updateVisible(@Body() status: UpdateVisible) {
    return this.menuService.updateVisible(status)
  }
  // 删除某一个菜单
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.menuService.remove(id)
  }
}

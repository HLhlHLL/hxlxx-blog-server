import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { MenuGuard } from 'src/libs/guard/menu.guard'

@Controller('role')
@Menu(14)
@UseGuards(JwtAuthGuard)
@UseGuards(MenuGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }

  @Get()
  @Menu(0)
  findAll() {
    return this.roleService.findAll()
  }

  @Get('/menu')
  @Menu(0)
  getMenu() {
    return this.roleService.getMenu()
  }

  @Get(':id')
  @Menu(0)
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.roleService.findById(id)
  }

  @Patch()
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto)
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.roleService.remove(id)
  }
}

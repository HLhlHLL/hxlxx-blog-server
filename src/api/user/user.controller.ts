import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Session
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { MenuGuard } from 'src/libs/guard/menu.guard'

@Controller('user')
@Menu(10)
@UseGuards(MenuGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  //注册
  @Post('/register')
  @Menu(0)
  register(@Body() createUserDto: CreateUserDto, @Session() session) {
    const emailCode = session.emailCode
    return this.userService.register(createUserDto, emailCode)
  }
  // 获取所有用户
  @Get()
  @Menu(0)
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll()
  }
  // 获取某个用户
  @Get(':id')
  @Menu(0)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findById(id)
  }
  // 更新用户角色
  @Patch('/role')
  @UseGuards(JwtAuthGuard)
  updateUserRole(@Body() user: UpdateUserDto) {
    return this.userService.updateUserRole(user)
  }
  // 更新用户状态
  @Patch('/status')
  @UseGuards(JwtAuthGuard)
  updateUserStatus(@Body() user: UpdateUserDto) {
    return this.userService.updateUserStatus(user)
  }
  // 重置用户名
  @Patch('/username')
  @UseGuards(JwtAuthGuard)
  resetUsername(@Body() user: UpdateUserDto) {
    return this.userService.resetUsername(user)
  }
  // 重置密码的前置验证
  @Post('/auth')
  @UseGuards(JwtAuthGuard)
  authentication(@Body() user: UpdateUserDto) {
    return this.userService.authentication(user)
  }
  // 重置密码
  @Patch('/password')
  @UseGuards(JwtAuthGuard)
  resetPassword(@Body() user: UpdateUserDto) {
    return this.userService.resetPassword(user)
  }
  // 修改头像
  // 删除用户
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.userService.remove(id)
  }
}

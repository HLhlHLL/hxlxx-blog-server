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
  @Menu(10)
  @UseGuards(JwtAuthGuard)
  updateUserRole(@Body() user: UpdateUserDto) {
    return this.userService.updateUserRole(user)
  }
  // 更新用户状态
  @Patch('/status')
  @Menu(10)
  @UseGuards(JwtAuthGuard)
  updateUserStatus(@Body() user: UpdateUserDto) {
    return this.userService.updateUserStatus(user)
  }
  // 重置用户名
  @Patch('/username')
  @UseGuards(JwtAuthGuard)
  @Menu(19)
  resetUsername(@Body() user: UpdateUserDto) {
    return this.userService.resetUsername(user)
  }
  // 重置密码
  @Patch('/password')
  @Menu(19)
  resetPassword(@Body() passwordInfo: any, @Session() session) {
    const emailCode = session.emailCode
    return this.userService.resetPassword(passwordInfo, emailCode)
  }
  // 修改头像
  @Patch('/avatar')
  @UseGuards(JwtAuthGuard)
  @Menu(19)
  resetAvatar(@Body() user: UpdateUserDto) {
    return this.userService.resetAvatar(user)
  }
  // 删除用户
  @Delete(':id')
  @Menu(10)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.userService.remove(id)
  }
}

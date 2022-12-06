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
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import config from 'env.config'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //注册
  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto)
  }
  // 获取所有用户
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll()
  }
  // 获取某个用户
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.findById(id)
  }
  // 重置用户名
  @Patch('/reset_name')
  resetUsername(@Body() user: UpdateUserDto) {
    return this.userService.resetUsername(user)
  }
  // 重置密码的前置验证
  @Post('/auth')
  authentication(@Body() user: UpdateUserDto) {
    return this.userService.authentication(user)
  }
  // 重置密码
  @Patch('/reset_pwd')
  resetPassword(@Body() user: UpdateUserDto) {
    return this.userService.resetPassword(user)
  }
  // 修改头像
  @Patch('/reset_avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  resetAvatar(
    @Body('id', new ParseIntPipe()) id: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    const avatar_url = `${config.BASE_URL}/assets/avatar/${file.filename}`
    return this.userService.resetAvatar(id, avatar_url)
  }
  // 删除用户
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.userService.remove(id)
  }
}

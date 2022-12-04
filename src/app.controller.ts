import { Controller, Post, UseGuards, Body } from '@nestjs/common'
import { LocalAuthGuard } from 'src/libs/guard/local.guard'
import { AuthService } from 'src/auth/auth.service'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  login(@Body() info) {
    return this.authService.login(info)
  }

  @Post('/code')
  sendEmailCode(@Body() info) {
    return this.authService.sendEmailCode(info)
  }
}

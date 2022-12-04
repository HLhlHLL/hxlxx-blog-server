import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common'
import { LocalAuthGuard } from 'src/libs/guard/local.guard'
import { AuthService } from 'src/auth/auth.service'
import { JwtAuthGuard } from './libs/guard/jwt.guard'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user
  }
}

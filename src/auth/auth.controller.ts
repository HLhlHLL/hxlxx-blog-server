import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Res,
  Session
} from '@nestjs/common'
import { LocalAuthGuard } from 'src/libs/guard/local.guard'
import { AuthService } from 'src/auth/auth.service'
import * as svgCaptcha from 'svg-captcha'

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Body() info, @Session() session) {
    return this.authService.login(info, session.captcha || '')
  }

  @Get('/captcha')
  getCaptcha(@Res() res, @Session() session) {
    const { text, data } = svgCaptcha.create({
      size: 4,
      noise: 2,
      fontSize: 40,
      // color: true,
      background: '#e471b0',
      width: 80,
      height: 32
    })
    session.captcha = text
    res.type('image/svg+xml')
    res.send(data)
  }

  @Post('/code')
  sendEmailCode(@Body() info) {
    return this.authService.sendEmailCode(info)
  }
}

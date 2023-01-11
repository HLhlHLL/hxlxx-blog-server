import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Res,
  Session,
  Req
} from '@nestjs/common'
import { LocalAuthGuard } from 'src/libs/guard/local.guard'
import { AuthService } from 'src/auth/auth.service'
import * as svgCaptcha from 'svg-captcha'
import { Request } from 'express'

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // 登录
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  login(@Body() info, @Session() session, @Req() req: Request) {
    return this.authService.login(
      info,
      session.captcha || '',
      req.clientIp.replace('::ffff:', '')
    )
  }
  // 获取登录验证码
  @Get('/captcha')
  getCaptcha(@Res() res, @Session() session) {
    const { text, data } = svgCaptcha.create({
      size: 4,
      noise: 2,
      fontSize: 40,
      color: true,
      background: '#e471b0',
      width: 80,
      height: 32,
      ignoreChars: 'Igqaj'
    })
    session.captcha = text
    res.type('image/svg+xml')
    res.send(data)
  }
  // 获取注册验证码
  @Post('/code')
  sendEmailCode(@Body() info, @Session() session) {
    const code = Math.random().toString().slice(-6)
    session.emailCode = code
    return this.authService.sendEmailCode(code, info)
  }
}

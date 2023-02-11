import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Res,
  Session,
  Req,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common'
import { LocalAuthGuard } from 'src/libs/guard/local.guard'
import * as svgCaptcha from 'svg-captcha'
import { Request } from 'express'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service'
import config from 'env.config'

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}
  // 登录
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  login(@Body() info, @Session() session, @Req() req: Request) {
    return this.appService.login(
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
    return this.appService.sendEmailCode(code, info)
  }
  // 身份验证，由于上传图片
  @Get('/auth')
  @UseGuards(JwtAuthGuard)
  authorization(@Req() req: Request) {
    const token = req.headers['authorization']
    return this.appService.authorization(token)
  }
  // 上传图片
  @Post('/static')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return `${config.BASE_URL}/static/${file.filename}`
  }
}

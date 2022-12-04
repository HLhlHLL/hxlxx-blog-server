import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/api/user/user.service'
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'

import * as dayjs from 'dayjs'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUserName(username)
    if (user) {
      const isUserExist = bcrypt.compareSync(password, user.password)
      if (isUserExist) {
        const { password: _, ...result } = user
        return result
      } else {
        throw new HttpException(
          'The password is wrong!!',
          HttpStatus.BAD_REQUEST
        )
      }
    } else {
      throw new HttpException(
        'The user is not exist or the username is wrong!!',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  login(info) {
    const { id, username, code } = info
    const payload = { username, sub: id }
    if (global.EMAIL_CODE !== code) {
      throw new HttpException('The code is wrong!!', HttpStatus.BAD_REQUEST)
    }
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.TOKEN_SECRET,
        expiresIn: '1h'
      })
    }
  }

  async sendEmailCode(info) {
    const code = Math.random().toString().slice(-6)
    global.EMAIL_CODE = code
    const date = dayjs(new Date()).format('YYYY年MM月DD日 HH:mm:ss')
    const sendMailOptions: ISendMailOptions = {
      to: info.email,
      subject: info.subject || '用户邮箱验证',
      template: 'validate.code.ejs', //这里写你的模板名称，如果你的模板名称的单名如 validate.ejs ,直接写validate即可 系统会自动追加模板的后缀名,如果是多个，那就最好写全。
      //内容部分都是自定义的
      context: {
        code, //验证码
        date, //日期
        sign: info.sign || '系统邮件,回复无效。' //发送的签名,当然也可以不要
      }
      // attachments: [
      //     {
      //         filename: 'validate.code.ejs', //文件名
      //         path: path.join(process.cwd(), './src/email/template/validate.code.ejs') //服务端的文件地址
      //     }
      // ]
    }
    await this.mailerService.sendMail(sendMailOptions)
    return { message: '发送成功' }
  }
}

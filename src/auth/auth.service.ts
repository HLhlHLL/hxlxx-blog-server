import { HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { throwHttpException } from 'src/libs/utils'
import { compareSync } from 'bcryptjs'
import * as dayjs from 'dayjs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { User } from 'src/api/user/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.manager
      .createQueryBuilder(User, 'user')
      .addSelect(['user.password'])
      .where('user.username = :username', { username })
      .getOne()
    if (user) {
      return compareSync(password, user.password)
        ? true
        : throwHttpException('The password is wrong!!', HttpStatus.BAD_REQUEST)
    } else {
      throwHttpException('The user is not exist!!', HttpStatus.BAD_REQUEST)
    }
  }

  async login(info, captcha: string, ip: string) {
    const { username, code } = info
    if (code?.toLowerCase() === captcha.toLowerCase()) {
      const user = await this.manager
        .createQueryBuilder(User, 'user')
        .where('user.username = :username', { username })
        .getOne()
      const payload = { username, sub: code }
      return {
        token: 'Bearer ' + this.jwtService.sign(payload),
        user
      }
    } else {
      throwHttpException('The captcha code is wrong', HttpStatus.BAD_REQUEST)
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

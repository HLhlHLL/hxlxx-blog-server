import { HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { isValidDate, throwHttpException } from 'src/libs/utils'
import { compareSync } from 'bcryptjs'
import * as dayjs from 'dayjs'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { User } from 'src/api/user/entities/user.entity'
import { Site } from './api/site/entities/site.entity'
import axios from 'axios'
import config from 'env.config'

@Injectable()
export class AppService {
  private readonly LOGGED_TIME_OFFSET: number = 60 * 60 * 6 * 1000

  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.manager
      .createQueryBuilder(User, 'user')
      .addSelect(['user.password'])
      .where('user.email = :email', { email })
      .getOne()
    if (user) {
      return compareSync(password, user.password)
        ? true
        : throwHttpException('密码错误！', HttpStatus.BAD_REQUEST)
    } else {
      throwHttpException('用户不存在！', HttpStatus.BAD_REQUEST)
    }
  }

  async login(info: any, captcha: string, ip: string) {
    const { username: email, code } = info
    if (email && code?.toLowerCase() === captcha.toLowerCase()) {
      const user = (
        await this.manager.find(User, {
          relations: ['role'],
          where: { email }
        })
      )[0]
      user.logged_ip = user.ip
      user.ip = ip
      const { data } = await axios.get(config.QUERY_IP_BASEURL(ip))
      user.address = data[0]?.location || ''
      if (isValidDate(user.logged_at)) {
        // 用户上次登陆过，判断上次登录间隔，大于6小时重新记录
        const lastTime = new Date(user.logged_at).getTime()
        const currentTime = new Date().getTime()
        if (currentTime - this.LOGGED_TIME_OFFSET > lastTime) {
          user.logged_at = new Date()
          // 更新访问量
          const site = new Site()
          site.username = user.email
          site.ip = user.ip
          site.address = user.address
          await this.manager.save(site)
        }
      } else {
        user.logged_at = new Date()
        const site = new Site()
        site.username = user.email
        site.ip = user.ip
        site.address = user.address
        await this.manager.save(site)
      }
      await this.manager.save(user)
      if (!user.status) {
        throwHttpException('该用户已被禁用！', HttpStatus.I_AM_A_TEAPOT)
      }
      const payload = { email, id: user.id }
      return {
        token: 'Bearer ' + this.jwtService.sign(payload),
        user
      }
    } else {
      throwHttpException('验证码错误！', HttpStatus.BAD_REQUEST)
    }
  }

  async sendEmailCode(code: string, info: any) {
    const isExist = await this.manager.findOneBy(User, { email: info.email })
    if (isExist) {
      throwHttpException('该邮箱已被注册！', HttpStatus.BAD_REQUEST)
    }
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
    return { message: '验证码已发送到邮箱，请尽快使用！' }
  }

  async authorization(token: string) {
    const { email } = this.jwtService.decode(
      token.replace('Bearer ', '')
    ) as any
    const { role } = await this.manager
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.role', 'role')
      .select(['user.username', 'role.role_name', 'role.permission_menu'])
      .where('user.email = :email', { email })
      .getOne()
    if (role.role_name === 'admin') return 'Authorized'
    throwHttpException('UnAuthorized', HttpStatus.FORBIDDEN)
  }
}

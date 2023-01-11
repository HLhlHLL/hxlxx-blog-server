import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { JwtStrategy } from '../libs/strategies/jwt.strategy'
import { LocalStrategy } from '../libs/strategies/local.strategy'
import { MailerModule } from '@nestjs-modules/mailer'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { join } from 'path'
import { AuthController } from './auth.controller'
import config from 'env.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Site } from './entities/site.entity'

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: config.TOKEN_SECRET,
      signOptions: { expiresIn: '1h' }
    }),
    MailerModule.forRoot({
      transport: {
        host: config.EMAIL_SERVER_HOST, //邮箱服务器地址
        port: config.EMAIL_SERVER_PORT, //服务器端口 默认 465
        auth: {
          user: config.ROOT_EMAIL, //你的邮箱地址
          pass: config.EMAIL_CLIENT_PASSWORD
        }
      },
      // preview: true, //是否开启预览，开启了这个属性，在调试模式下会自动打开一个网页，预览邮件
      defaults: {
        from: `验证邮件 <${config.ROOT_EMAIL}>` //发送人 你的邮箱地址
      },
      template: {
        dir: join(process.cwd(), './src/template'), //这里就是你的ejs模板文件夹路径
        adapter: new EjsAdapter(),
        options: {
          strict: true //严格模式
        }
      }
    }),
    TypeOrmModule.forFeature([Site])
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}

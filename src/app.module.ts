import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ArticleModule } from './api/article/article.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './api/user/user.module'
import { CommentModule } from './api/comment/comment.module'
import { TagModule } from './api/tag/tag.module'
import { CategoryModule } from './api/category/category.module'
// import { AuthModule } from './global-api/global-api.module'
import { RoleModule } from './api/role/role.module'
import { MenuModule } from './api/menu/menu.module'
import { GlobalJwtModule } from './jwt/jwt.module'
import { SiteModule } from './api/site/site.module'
import { OperationLoggerModule } from './api/operation-logger/operation-logger.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { OperationLoggerInterceptor } from './libs/interceptor/operation-logger.interceptor'
import { AlbumModule } from './api/album/album.module'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import config from 'env.config'
import { imageFileFilter } from './libs/utils'
import { PassportModule } from '@nestjs/passport'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { MailerModule } from '@nestjs-modules/mailer'
import { JwtModule } from '@nestjs/jwt'
import { LocalStrategy } from './libs/strategies/local.strategy'
import { JwtStrategy } from './libs/strategies/jwt.strategy'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: config.DATABASE_TYPE, //数据库类型
      username: config.MYSQL_USERNAME, //账号
      password: config.MYSQL_PASSWORD, //密码
      host: config.MYSQL_HOST, //host
      port: config.MYSQL_PORT, //
      database: config.MYSQL_DATABASE_NAME, //库名
      retryDelay: 500, //重试连接数据库间隔
      retryAttempts: 10, //重试连接数据库的次数
      autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
      synchronize: true //synchronize字段代表是否自动将实体类同步到数据库
      // entities: [__dirname + './**/*.entity.{js,ts}']
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, './assets/static'),
        filename: (req, file, callback) => {
          const prefix = req.body.imgType ? 'default_' + req.body.imgType : ''
          const filename = `${
            (prefix || new Date().getTime()) + extname(file.originalname)
          }`
          callback(null, filename)
        }
      }),
      limits: {
        fileSize: 1024 * 1024 * 5
      },
      fileFilter: imageFileFilter
    }),
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
    PassportModule,
    ArticleModule,
    UserModule,
    CommentModule,
    TagModule,
    CategoryModule,
    // AuthModule,
    RoleModule,
    GlobalJwtModule,
    MenuModule,
    SiteModule,
    OperationLoggerModule,
    AlbumModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: OperationLoggerInterceptor
    }
  ],
  exports: [AppService]
})
export class AppModule {}

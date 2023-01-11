import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ArticleModule } from './api/article/article.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './api/user/user.module'
import { CommentModule } from './api/comment/comment.module'
import { TagModule } from './api/tag/tag.module'
import { CategoryModule } from './api/category/category.module'
import { AuthModule } from './auth/auth.module'
import { RoleModule } from './api/role/role.module'
import { MenuModule } from './api/menu/menu.module'
import { GlobalJwtModule } from './jwt/jwt.module'
import config from 'env.config'

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
    ArticleModule,
    UserModule,
    CommentModule,
    TagModule,
    CategoryModule,
    AuthModule,
    RoleModule,
    GlobalJwtModule,
    MenuModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

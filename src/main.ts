import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ResponseInterceptor } from './libs/interceptor/response.interceptor'
import { ExcFilter } from './libs/filter/exception.filter'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import * as dotenv from 'dotenv'
import * as session from 'express-session'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.use(
    session({
      secret: 'hxlxx',
      name: 'hxlxx-sid',
      rolling: true,
      cookie: { maxAge: 1000 * 60 * 30 }
    })
  )
  app.useGlobalFilters(new ExcFilter())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useStaticAssets(join(__dirname, '../assets'), { prefix: '/assets' })
  await app.listen(3000)
}
bootstrap()

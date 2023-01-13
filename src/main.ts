import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ResponseInterceptor } from './libs/interceptor/response.interceptor'
import { ExcFilter } from './libs/filter/exception.filter'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as requestIp from 'request-ip'
import * as session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.use(requestIp.mw())
  app.use(
    session({
      secret: 'hxlxx',
      name: 'hxlxx-sid',
      rolling: true,
      cookie: { maxAge: 1000 * 60 * 30 }
    })
  )
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new ExcFilter())
  await app.listen(3000)
}
bootstrap()

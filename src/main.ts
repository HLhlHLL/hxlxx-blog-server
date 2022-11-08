import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import ResInterceptor from './libs/interceptor/ResInterceptor'
import ExcFilter from './libs/filter/ExceptionFilter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new ExcFilter())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new ResInterceptor())
  await app.listen(3000)
}
bootstrap()

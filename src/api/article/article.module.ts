import { Module } from '@nestjs/common'
import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Article } from './entities/article.entity'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join } from 'path'
import { fileNameGenerator, imageFileFilter } from 'src/libs/utils'

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../../assets/article_cover'),
        filename: fileNameGenerator
      }),
      limits: {
        fileSize: 1024 * 1024 * 2
      },
      fileFilter: imageFileFilter
    })
  ],
  controllers: [ArticleController],
  providers: [ArticleService]
})
export class ArticleModule {}

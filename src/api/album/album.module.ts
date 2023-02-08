import { Module } from '@nestjs/common'
import { AlbumService } from './album.service'
import { AlbumController } from './album.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join } from 'path'
import { fileNameGenerator, imageFileFilter } from 'src/libs/utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Album } from './entities/album.entity'

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../assets/album'),
        filename: fileNameGenerator
      }),
      limits: {
        fileSize: 1024 * 1024 * 2
      },
      fileFilter: imageFileFilter
    }),
    TypeOrmModule.forFeature([Album])
  ],
  controllers: [AlbumController],
  providers: [AlbumService]
})
export class AlbumModule {}

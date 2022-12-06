import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join } from 'path'
import { fileNameGenerator, imageFileFilter } from 'src/libs/utils'

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../assets/imgs'),
        filename: fileNameGenerator
      }),
      limits: {
        fileSize: 1024 * 1024
      },
      fileFilter: imageFileFilter
    })
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService]
})
export class UploadModule {}

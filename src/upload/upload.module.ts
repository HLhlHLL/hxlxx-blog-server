import { Module } from '@nestjs/common'
import { UploadService } from './upload.service'
import { UploadController } from './upload.controller'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: process.cwd() + './dist/imgs',
        filename: (req, file, callback) => {
          const filename = `${
            new Date().getTime() + extname(file.originalname)
          }`
          callback(null, filename)
        }
      }),
      limits: {
        fileSize: 1024 * 1024
      },
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false)
        }
        callback(null, true)
      }
    })
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}

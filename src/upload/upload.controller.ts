import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadService } from './upload.service'
import config from '../../env.config'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/img')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file)
    return {
      file_url: `${config.BASE_URL}/imgs/${file.filename}`,
      file_name: file.filename
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { AlbumService } from './album.service'

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    return this.albumService.create(file.filename)
  }

  @Get()
  findAll() {
    return this.albumService.findAll()
  }

  @Delete(':filename')
  remove(@Param('filename') filename: string) {
    return this.albumService.remove(filename)
  }
}

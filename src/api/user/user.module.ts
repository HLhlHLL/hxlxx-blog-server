import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { join } from 'path'
import { fileNameGenerator, imageFileFilter } from 'src/libs/utils'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../../assets/avatar'),
        filename: fileNameGenerator
      }),
      limits: {
        fileSize: 1024 * 1024
      },
      fileFilter: imageFileFilter
    })
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}

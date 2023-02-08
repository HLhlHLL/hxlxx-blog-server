import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import config from 'env.config'
import { throwHttpException } from 'src/libs/utils'
import { Repository } from 'typeorm'
import { Album } from './entities/album.entity'

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album) private readonly albumRep: Repository<Album>
  ) {}

  async create(filename) {
    const album = new Album()
    album.filename = filename
    album.url = config.BASE_URL + '/album/' + filename
    await this.albumRep.save(album)
    return '图片上传成功！'
  }

  async findAll() {
    const res = await this.albumRep.find()
    return res
  }

  async remove(filename) {
    const { affected } = await this.albumRep.delete({ filename })
    if (affected > 0) {
      return '删除图片成功！'
    } else {
      throwHttpException('参数错误，删除文章分类失败！', HttpStatus.BAD_REQUEST)
    }
  }
}

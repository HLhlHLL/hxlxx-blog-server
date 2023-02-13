import { HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { throwHttpException } from 'src/libs/utils'
import { EntityManager, Repository } from 'typeorm'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoryService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    @InjectRepository(Category)
    private readonly categoryRep: Repository<Category>
  ) {}

  async create({ category_name }: CreateCategoryDto) {
    const isExist = await this.categoryRep.findOneBy({ category_name })
    if (isExist) {
      throwHttpException(
        '文章分类已经存在，请勿重复添加！',
        HttpStatus.BAD_REQUEST
      )
    }
    const category = new Category()
    category.category_name = category_name
    const res = await this.categoryRep.save(category)
    return res
  }

  async findAll() {
    const [res, count] = await this.categoryRep.findAndCount()
    return { res, count }
  }

  async findCategoryAndCount() {
    const res = await this.categoryRep
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.articles', 'article')
      .select(['category_name', 'category.id id'])
      .where('article.status = :status', { status: true })
      .addSelect('COUNT(category.id)', 'count')
      .groupBy('category.id')
      .getRawMany()
    return res
  }

  async findCategoryTop10() {
    const res = await this.categoryRep
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.articles', 'article')
      .select(['category_name', 'category.id id'])
      .where('article.status = :status', { status: true })
      .addSelect('COUNT(category.id)', 'count')
      .groupBy('category.id')
      .limit(10)
      .getRawMany()
    return res
  }

  async findById(id: number) {
    const res = await this.categoryRep.findOneBy({ id })
    return res
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { affected } = await this.categoryRep.update(id, updateCategoryDto)
    if (affected > 0) {
      return '更新文章分类成功！'
    } else {
      throwHttpException('参数错误，更新文章分类失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async removeById(id: number) {
    const { affected } = await this.categoryRep.delete(id)
    if (affected > 0) {
      return '删除文章分类成功！'
    } else {
      throwHttpException('参数错误，删除文章分类失败！', HttpStatus.BAD_REQUEST)
    }
  }

  async removeByIds(ids: number[]) {
    await this.manager.transaction(async (_manager) => {
      for (const id of ids) {
        await _manager.delete(Category, id)
      }
    })
    return '批量删除文章分类成功！'
  }
}

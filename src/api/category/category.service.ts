import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
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
    const cate = new Category()
    cate.category_name = category_name
    const res = await this.categoryRep.save(cate)
    return res
  }

  async findAll() {
    const [res, count] = await this.categoryRep.findAndCount()
    return { res, count }
  }

  async findById(id: number) {
    const res = await this.categoryRep.findOneBy({ id })
    return res
  }

  async update(id: number, { category_name }: UpdateCategoryDto) {
    const res = await this.categoryRep.update(id, { category_name })
    console.log(res)
    return 'update category successfully'
  }

  async remove(id: number) {
    await this.categoryRep.delete(id)
    return 'delete category successfully'
  }
}

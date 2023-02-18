import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { MenuGuard } from 'src/libs/guard/menu.guard'
import { AboutService } from './about.service'

@Controller('about')
@Menu(25)
@UseGuards(MenuGuard)
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body('content') content: string) {
    return this.aboutService.create(content)
  }

  @Get()
  @Menu(0)
  findOne() {
    return this.aboutService.findOne()
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body('content') content: string
  ) {
    return this.aboutService.update(id, content)
  }
}

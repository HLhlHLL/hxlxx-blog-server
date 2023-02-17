import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query
} from '@nestjs/common'
import { TalkService } from './talk.service'
import { CreateTalkDto } from './dto/create-talk.dto'
import { UpdateTalkDto } from './dto/update-talk.dto'
import { MenuGuard } from 'src/libs/guard/menu.guard'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'

@Controller('talk')
@UseGuards(MenuGuard)
@Menu(24)
export class TalkController {
  constructor(private readonly talkService: TalkService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTalkDto: CreateTalkDto) {
    return this.talkService.create(createTalkDto)
  }

  @Get()
  @Menu(0)
  findAll(
    @Query('skip', new ParseIntPipe()) skip: number,
    @Query('limit', new ParseIntPipe()) limit: number
  ) {
    return this.talkService.findAll(skip, limit)
  }

  @Get(':id')
  @Menu(0)
  findOneById(@Param('id', new ParseIntPipe()) id: number) {
    return this.talkService.findOneById(id)
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  update(@Body() updateTalkDto: UpdateTalkDto) {
    return this.talkService.update(updateTalkDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  removeById(@Param('id', new ParseIntPipe()) id: number) {
    return this.talkService.removeById(id)
  }
}

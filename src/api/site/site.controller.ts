import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { Menu } from 'src/libs/decorator/menu/menu.decorator'
import { JwtAuthGuard } from 'src/libs/guard/jwt.guard'
import { MenuGuard } from 'src/libs/guard/menu.guard'
import { UpdateConfigDto } from './dto/update-config.dto'
import { SiteService } from './site.service'

@Controller('site')
@Menu(21)
@UseGuards(MenuGuard)
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('/info')
  @Menu(0)
  getSiteInfo() {
    return this.siteService.getSiteInfo()
  }

  @Get('/profile')
  @Menu(0)
  getSiteProfile() {
    return this.siteService.getSiteProfile()
  }

  @Get('/config')
  @Menu(0)
  getWebsiteConfig() {
    return this.siteService.getWebsiteConfig()
  }

  @Patch('/config')
  @UseGuards(JwtAuthGuard)
  updateWbeSiteConfig(@Body() config: UpdateConfigDto) {
    return this.siteService.updateWbeSiteConfig(config)
  }
}

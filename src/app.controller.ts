import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/site/info')
  getSiteInfo() {
    return this.appService.getSiteInfo()
  }
}

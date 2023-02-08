import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Site } from './entities/site.entity'
import { WebsiteConfig } from './entities/website-config.entity'
import { SiteController } from './site.controller'
import { SiteService } from './site.service'

@Module({
  imports: [TypeOrmModule.forFeature([Site, WebsiteConfig])],
  controllers: [SiteController],
  providers: [SiteService]
})
export class SiteModule {}

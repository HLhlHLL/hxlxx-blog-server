import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AppService } from 'src/app.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly appService: AppService) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    const result = await this.appService.validateUser(username, password)
    if (!result) {
      throw new UnauthorizedException()
    }
    return result
  }
}

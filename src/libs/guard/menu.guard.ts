import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Request } from 'express'
import { User } from 'src/api/user/entities/user.entity'
import { EntityManager } from 'typeorm'
import { MENU_KEY } from '../decorator/menu/menu.decorator'

@Injectable()
export class MenuGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @InjectEntityManager() private readonly manager: EntityManager
  ) {}

  canActivate(context: ExecutionContext) {
    const requireMenu = this.reflector.getAllAndOverride<number>(MENU_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requireMenu) return true

    const request = context.switchToHttp().getRequest<Request>()
    const token = request.headers.authorization.split(' ')[1] || ''
    const { username } = this.jwtService.decode(token) as any
    return this.validate(username, requireMenu)
  }

  async validate(username: string, permission: number) {
    const { role } = await this.manager
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.role', 'role')
      .select(['user.username', 'role.permission_menu'])
      .where('user.username = :username', { username })
      .getOne()
    if (role.role_name === 'admin') return true
    return (role.permission_menu as unknown as number[]).includes(permission)
  }
}

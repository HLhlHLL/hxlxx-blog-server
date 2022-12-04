import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '../api/user/user.module'
import { AuthService } from './auth.service'
import { JwtStrategy } from '../libs/strategies/jwt.strategy'
import { LocalStrategy } from '../libs/strategies/local.strategy'

@Module({
  imports: [UserModule, PassportModule, JwtModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}

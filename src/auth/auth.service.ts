import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from 'src/api/user/dto/create-user.dto'
import { UserService } from 'src/api/user/user.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUserName(username)

    if (user) {
      const isUserExist = bcrypt.compareSync(password, user.password)
      if (isUserExist) {
        const { password: _, ...result } = user
        return result
      } else {
        throw new HttpException(
          'The password is wrong!!',
          HttpStatus.BAD_REQUEST
        )
      }
    } else {
      throw new HttpException(
        'The user is not exist or the username is wrong!!',
        HttpStatus.BAD_REQUEST
      )
    }
  }

  login(user: CreateUserDto) {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.TOKEN_SECRET,
        expiresIn: '1h'
      })
    }
  }
}

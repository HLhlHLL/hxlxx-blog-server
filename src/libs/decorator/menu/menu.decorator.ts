import { SetMetadata } from '@nestjs/common'

export const MENU_KEY = 'menu'
export const Menu = (menu: number) => SetMetadata(MENU_KEY, menu)

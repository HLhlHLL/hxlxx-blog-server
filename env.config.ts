import { join } from 'path'

export interface IEnvConfig {
  DATABASE_TYPE: 'mysql'
  MYSQL_USERNAME: string
  MYSQL_PASSWORD: string
  MYSQL_HOST: string
  MYSQL_PORT: number
  MYSQL_DATABASE_NAME: string
  TOKEN_SECRET: string
  BASE_URL: string
  STATICE_DIRECTORY: string
  EMAIL_SERVER_HOST: string
  EMAIL_SERVER_PORT: number
  EMAIL_CLIENT_PASSWORD: string
  ROOT_EMAIL: string
  DEFAULT_AVATAR_URL: string
  QUERY_IP_BASEURL: (ip: string) => string
}

const config: IEnvConfig = {
  DATABASE_TYPE: 'mysql',
  MYSQL_USERNAME: 'root',
  MYSQL_PASSWORD: '123456',
  MYSQL_HOST: 'localhost',
  MYSQL_PORT: 3306,
  MYSQL_DATABASE_NAME: 'blog',
  TOKEN_SECRET: 'hxlxx-xxxx',
  BASE_URL: 'http://localhost:3000',
  STATICE_DIRECTORY: join(__dirname, 'assets'),
  EMAIL_SERVER_HOST: 'smtp.exmail.qq.com',
  EMAIL_SERVER_PORT: 465,
  EMAIL_CLIENT_PASSWORD: 'Rw589TFn6oihZ4vu',
  ROOT_EMAIL: 'huanglei@hxlx33.wecom.work',
  DEFAULT_AVATAR_URL: 'https://imgbed.hxlxx.xyz/default_avatar.jpg',
  QUERY_IP_BASEURL: (ip: string) =>
    `http://opendata.baidu.com/api.php?query=${ip}&co=&resource_id=6006&oe=utf8`
}

export default config

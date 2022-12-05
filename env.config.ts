export interface IEnvConfig {
  DATABASE_TYPE: 'mysql'
  MYSQL_USERNAME: string
  MYSQL_PASSWORD: string
  MYSQL_HOST: string
  MYSQL_PORT: number
  MYSQL_DATABASE_NAME: string
  BASE_URL: string
  EMAIL_SERVER_HOST: string
  EMAIL_SERVER_PORT: number
  EMAIL_CLIENT_PASSWORD: string
  ROOT_EMAIL: string
}

const config: IEnvConfig = {
  DATABASE_TYPE: 'mysql',
  MYSQL_USERNAME: 'root',
  MYSQL_PASSWORD: '123456',
  MYSQL_HOST: 'localhost',
  MYSQL_PORT: 3306,
  MYSQL_DATABASE_NAME: 'blog',
  BASE_URL: 'http://localhost',
  EMAIL_SERVER_HOST: 'smtp.exmail.qq.com',
  EMAIL_SERVER_PORT: 465,
  EMAIL_CLIENT_PASSWORD: 'Rw589TFn6oihZ4vu',
  ROOT_EMAIL: 'huanglei@hxlx33.wecom.work'
}

export default config

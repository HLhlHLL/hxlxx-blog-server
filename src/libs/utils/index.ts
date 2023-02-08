import { HttpException, HttpStatus } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { extname } from 'path'

export const throwHttpException = (
  message: string | Record<string, any>,
  code: HttpStatus
) => {
  throw new HttpException(message, code)
}

export const throwValidateException = (errors: ValidationError[]) => {
  const message = errors.reduce((memo, cur) => {
    return (memo = [...memo, ...Object.values(cur.constraints)])
  }, [])
  throwHttpException(
    {
      statusCode: HttpStatus.BAD_REQUEST,
      message,
      error: 'BAD_REQUEST'
    },
    HttpStatus.BAD_REQUEST
  )
}

export const fileNameGenerator = (req, file, callback) => {
  const filename = `${new Date().getTime() + extname(file.originalname)}`
  callback(null, filename)
}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return callback(new Error('Only image files are allowed!'), false)
  }
  callback(null, true)
}

export const isValidDate = (date: Date) => {
  return date instanceof Date && !Number.isNaN(date.getTime())
}

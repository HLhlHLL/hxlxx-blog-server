import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform
} from '@nestjs/common'

export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value)
    if (isNaN(val)) {
      throw new BadRequestException(
        'The parameter should be a number, please check if you pick the right type'
      )
    }
    return val
  }
}

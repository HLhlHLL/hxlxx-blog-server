export class CreateCommentDto {
  id: number

  uid: number

  pid: number

  aid: number

  reply_to?: string

  content: string
}

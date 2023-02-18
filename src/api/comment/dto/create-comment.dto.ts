export class CreateCommentDto {
  id: number

  uid: number

  pid: number

  topic_id: number

  reply_to?: string

  content: string
}

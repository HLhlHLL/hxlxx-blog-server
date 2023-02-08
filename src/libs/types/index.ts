export type QueryInfo = {
  skip?: string
  limit?: string
  keyword?: string
  tag_id?: string
  category_id?: string
}

export type UpdateTopOrRec = {
  id: number
  top?: boolean
  recommend?: boolean
}

export type UpdateVisible = {
  id: number
  visible: boolean
}

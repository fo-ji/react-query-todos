import { useQueryClient, useMutation } from 'react-query'
import axios from 'axios'

import { useAppDispatch } from '../app/hooks'
import { resetEditedTag } from '../slices/todoSlice'
import { Tag } from '../types/types'

export const useMutateTag = () => {
  const dispatch = useAppDispatch()
  // stateを編集する為に既存の情報をuseQueryClient関数で取得する
  const queryClient = useQueryClient()

  const createTagMutation = useMutation(
    // post(新規作成)の場合、idが不要なのでomitでtypeから取り除く
    (tag: Omit<Tag, 'id'>) =>
      axios.post<Tag>(`${process.env.REACT_APP_REST_URL}/tags/`, tag),
    {
      // postメソッドの成功時の後処理はonSuccessで
      onSuccess: (res) => {
        // getQueryDataで既存のtasksを取得する
        const previousTags = queryClient.getQueryData<Tag[]>('tags')
        if (previousTags) {
          // キャッシュを書き換える時はsetQueryDataを使用
          queryClient.setQueryData<Tag[]>('tags', [...previousTags, res.data])
        }
        dispatch(resetEditedTag())
      },
    }
  )

  const updateTagMutation = useMutation(
    (tag: Tag) =>
      axios.put<Tag>(`${process.env.REACT_APP_REST_URL}/tags/${tag.id}/`, tag),
    {
      // onSuccessの第2引数には更新前に渡したデータを受け取れる(↑上のtag)
      onSuccess: (res, variables) => {
        const previousTags = queryClient.getQueryData<Tag[]>('tags')
        if (previousTags) {
          queryClient.setQueryData<Tag[]>(
            'tags',
            previousTags.map((tag) =>
              tag.id === variables.id ? res.data : tag
            )
          )
        }
        dispatch(resetEditedTag())
      },
    }
  )

  const deleteTagMutation = useMutation(
    (id: number) =>
      axios.delete(`${process.env.REACT_APP_REST_URL}/tags/${id}/`),
    {
      onSuccess: (res, variables) => {
        const previousTags = queryClient.getQueryData<Tag[]>('tags')
        if (previousTags) {
          queryClient.setQueryData<Tag[]>(
            'tags',
            previousTags.filter((tag) => tag.id !== variables)
          )
        }
        dispatch(resetEditedTag())
      },
    }
  )
  return { createTagMutation, updateTagMutation, deleteTagMutation }
}

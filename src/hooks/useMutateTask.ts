import { useQueryClient, useMutation } from 'react-query'
import axios from 'axios'

import { useAppDispatch } from '../app/hooks'
import { resetEditedTask } from '../slices/todoSlice'
import { Task, EditTask } from '../types/types'

export const useMutateTask = () => {
  const dispatch = useAppDispatch()
  // stateを編集する為に既存の情報をuseQueryClient関数で取得する
  const queryClient = useQueryClient()

  const createTaskMutation = useMutation(
    // post(新規作成)の場合、idが不要なのでomitでtypeから取り除く
    (task: Omit<EditTask, 'id'>) =>
      axios.post<Task>(`${process.env.REACT_APP_REST_URL}/tasks/`, task),
    {
      // postメソッドの成功時の後処理はonSuccessで
      onSuccess: (res) => {
        // getQueryDataで既存のtasksを取得する
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          // キャッシュを書き換える時はsetQueryDataを使用
          queryClient.setQueryData<Task[]>('tasks', [
            ...previousTodos,
            res.data,
          ])
        }
        dispatch(resetEditedTask())
      },
    }
  )

  const updateTaskMutation = useMutation(
    (task: EditTask) =>
      axios.put<Task>(
        `${process.env.REACT_APP_REST_URL}/tasks/${task.id}/`,
        task
      ),
    {
      // onSuccessの第2引数には更新前に渡したデータを受け取れる(↑上のtask)
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.map((task) =>
              task.id === variables.id ? res.data : task
            )
          )
        }
        dispatch(resetEditedTask())
      },
    }
  )

  const deleteTaskMutation = useMutation(
    (id: number) =>
      axios.delete(`${process.env.REACT_APP_REST_URL}/tasks/${id}/`),
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.filter((task) => task.id !== variables)
          )
        }
        dispatch(resetEditedTask())
      },
    }
  )
  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}

import { memo, VFC } from 'react'
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid'

import { useAppDispatch } from '../app/hooks'
import { setEditedTask } from '../slices/todoSlice'
import { useMutateTask } from '../hooks/useMutateTask'
import { Task } from '../types/types'

interface Props {
  task: Task
}

const TaskItem: VFC<Props> = (props) => {
  const { task } = props
  const dispatch = useAppDispatch()
  const { deleteTaskMutation } = useMutateTask()

  if (deleteTaskMutation.isLoading) {
    return <p>Deleting...</p>
  }

  console.log('rendered TaskItem')

  return (
    <li className="my-3">
      <span className="font-bold">{task.title}</span>
      <span>
        {' : '}
        {task.tag_name}
      </span>

      <div className="flex float-right ml-20">
        <PencilAltIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            dispatch(
              setEditedTask({
                id: task.id,
                title: task.title,
                tag: task.tag,
              })
            )
          }}
        />
        <TrashIcon
          className="h-5 w-5 text-blue-500 cursor-pointer"
          onClick={() => {
            // useMutationで定義した関数はmutateで実行する
            deleteTaskMutation.mutate(task.id)
          }}
        />
      </div>
    </li>
  )
}

export const TaskItemMemo = memo(TaskItem)

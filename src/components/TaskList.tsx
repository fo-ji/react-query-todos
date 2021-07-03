import { memo, VFC } from 'react'

import { useQueryTasks } from '../hooks/useQueryTasks'
import { TaskItemMemo } from './TaskItem'

const TaskList: VFC = () => {
  const { data, status } = useQueryTasks()

  if (status === 'loading') return <div>{'Loading...'}</div>
  if (status === 'error') return <div>{'Error'}</div>

  console.log('rendered TaskList')

  return (
    <div>
      <ul>
        {data?.map((task) => (
          <TaskItemMemo key={task.id} task={task} />
        ))}
      </ul>
    </div>
  )
}

export const TaskListMemo = memo(TaskList)

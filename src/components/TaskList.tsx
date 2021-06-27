import { memo, VFC } from 'react'

import { useQueryTasks } from '../hooks/useQueryTasks'
import { TaskItem } from './TaskItem'

export const TaskList: VFC = memo(() => {
  const { data, status } = useQueryTasks()

  if (status === 'loading') return <div>{'Loading...'}</div>
  if (status === 'error') return <div>{'Error'}</div>

  console.log('rendered TaskList')

  return (
    <div>
      <ul>
        {data?.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  )
})

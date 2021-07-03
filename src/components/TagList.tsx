import { VFC, memo } from 'react'

import { useQueryTags } from '../hooks/useQueryTags'
import { TagItemMemo } from './TagItem'

const TagList: VFC = () => {
  const { status, data } = useQueryTags()

  if (status === 'loading') return <div>{'Loading...'}</div>
  if (status === 'error') return <div>{'Error'}</div>

  console.log('rendered TagList')

  return (
    <div>
      {data?.map((tag) => (
        <div key={tag.id}>
          <ul>
            <TagItemMemo tag={tag} />
          </ul>
        </div>
      ))}
    </div>
  )
}

export const TagListMemo = memo(TagList)

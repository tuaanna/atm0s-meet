import { cn } from '@/lib'
import { map } from 'lodash'

type Props = {
  renderItem?: (item: any) => React.ReactNode
  items: any[]
}

const SLIDE_PER_VIEW = 25

export const GridViewLayout: React.FC<Props> = ({ items, renderItem }) => {
  const totalUser = items.length
  const columns = Math.ceil(Math.sqrt(totalUser)) > 5 ? 5 : Math.ceil(Math.sqrt(totalUser)) // The column is based on the square root of n
  const rows = Math.ceil(totalUser / columns) // Rows are based on dividing numbers evenly in rows
  const leftoverItems = totalUser % columns // Calculate the number of extra elements
  const checkFullRow = columns * rows === totalUser

  return (
    <div
      className={cn(
        `no-scrollbar grid h-full w-full grid-cols-1 overflow-auto md:grid-cols-2 xl:md:grid-rows-2 xl:grid-rows-${rows} xl:grid-cols-${columns} gap-4 duration-300`,
        items?.length > SLIDE_PER_VIEW && 'xl:grid-rows-none'
      )}
    >
      {map(items, (item, index) => {
        const isLeftover = index >= totalUser - leftoverItems
        const transformValue =
          leftoverItems > 0 && isLeftover
            ? `translateX(calc(${50 * (rows * columns - totalUser)}% + ${(rows * columns - totalUser) * 8}px))`
            : 'unset'

        return (
          <div
            key={index}
            className={'h-full w-full duration-300'}
            style={{
              transform: checkFullRow ? 'unset' : transformValue,
            }}
          >
            {renderItem?.(item) || item}
          </div>
        )
      })}
    </div>
  )
}

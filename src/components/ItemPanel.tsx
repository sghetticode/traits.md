import { cn } from '@/lib/utils'
import { items, ITEMS_PER_PAGE, type Item } from '@/data/items'
import { RATINGS, type Rating } from '@/data/ratings'
import type { Answers } from '@/lib/scoring'
import { tableClass } from '@/components/styles'
import { RatingRadioGroup } from '@/components/RatingRadioGroup'

interface ItemPanelProps {
  page: number // 1-10
  answers: Answers
  onAnswer: (item: Item, rating: Rating) => void
}

// One page of five items, each followed by a row of rating radios
export function ItemPanel({ page, answers, onAnswer }: ItemPanelProps) {
  const start = (page - 1) * ITEMS_PER_PAGE
  const pageItems = items.slice(start, start + ITEMS_PER_PAGE)

  return (
    <div className="h-full min-h-150">
      <table
        className={cn(
          tableClass,
          'table-fixed text-sm md:text-base 2xl:text-lg [&_tr>*]:border-b-mist-500/50',
          'max-sm:[&_tr>*]:px-1',
        )}
      >
        <colgroup>
          <col className="w-8 sm:w-12" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th scope="col" aria-label="Rating"></th>
            <th>
              <div
                className="rating-grid mb-2 text-[10px] leading-tight wrap-break-word
                  whitespace-normal sm:text-xs md:text-sm"
              >
                {RATINGS.map((rating) => (
                  <span key={rating.value} className={cn('w-full text-center', rating.header)}>
                    {rating.label}
                  </span>
                ))}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((item, i) => (
            <ItemRows
              key={item.id}
              item={item}
              position={start + i + 1}
              value={answers[item.id]}
              onAnswer={onAnswer}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface ItemRowsProps {
  item: Item
  position: number // shown to the user, 1-50; item.id is the storage key
  value: Rating | undefined
  onAnswer: ItemPanelProps['onAnswer']
}

function ItemRows({ item, position, value, onAnswer }: ItemRowsProps) {
  const textId = `item-${item.id}`

  return (
    <>
      <tr>
        <td>{position}</td>
        <td id={textId}>{item.text}</td>
      </tr>
      <tr>
        <td></td>
        <td>
          <RatingRadioGroup
            value={value}
            onChange={(rating) => onAnswer(item, rating)}
            labelledBy={textId}
          />
        </td>
      </tr>
    </>
  )
}

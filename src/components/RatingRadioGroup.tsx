import { cn } from '@/lib/utils'
import { CHECKED_FILL, RATINGS, type Rating } from '@/data/ratings'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface RatingRadioGroupProps {
  value: Rating | undefined
  onChange: (rating: Rating) => void
  labelledBy: string // id of the item text this group rates
}

// The five rating options for one item. Arrow keys move between them; Tab moves to the next item
export function RatingRadioGroup({ value, onChange, labelledBy }: RatingRadioGroupProps) {
  return (
    <RadioGroup
      className="rating-grid gap-0"
      value={value ?? ''}
      onValueChange={(next) => onChange(next as Rating)}
      aria-labelledby={labelledBy}
    >
      {RATINGS.map((rating) => (
        <RadioGroupItem
          key={rating.value}
          value={rating.value}
          aria-label={rating.value}
          className={cn(
            'size-6 cursor-pointer p-1 shadow-[inset_0_1px_oklch(0%_0_0/0.1)]',
            rating.color,
            rating.border,
            CHECKED_FILL,
          )}
        />
      ))}
    </RadioGroup>
  )
}

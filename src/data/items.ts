import type { Factor } from '@/factors'

export interface Item {
  id: number // canonical IPIP number (ipip-50-item-scale.md); the stable storage key
  text: string
  factor: Factor
  sign: '+' | '-'
}

// Display order of ipip-item-sets/reordered-50-item-scale-1.md. The number shown to the user is the
// item's position in this array, not its id
// prettier-ignore
export const items: Item[] = [
  { id: 6, text: "Don't talk a lot.", factor: 'extraversion', sign: '-' },
  { id: 7, text: 'Am interested in people.', factor: 'agreeableness', sign: '+' },
  { id: 8, text: 'Leave my belongings around.', factor: 'conscientiousness', sign: '-' },
  { id: 9, text: 'Am relaxed most of the time.', factor: 'emotional-stability', sign: '+' },
  { id: 10, text: 'Have difficulty understanding abstract ideas.', factor: 'intellect-imagination', sign: '-' },
  { id: 11, text: 'Feel comfortable around people.', factor: 'extraversion', sign: '+' },
  { id: 12, text: 'Insult people.', factor: 'agreeableness', sign: '-' },
  { id: 13, text: 'Pay attention to details.', factor: 'conscientiousness', sign: '+' },
  { id: 14, text: 'Worry about things.', factor: 'emotional-stability', sign: '-' },
  { id: 15, text: 'Have a vivid imagination.', factor: 'intellect-imagination', sign: '+' },
  { id: 16, text: 'Keep in the background.', factor: 'extraversion', sign: '-' },
  { id: 17, text: "Sympathize with others' feelings.", factor: 'agreeableness', sign: '+' },
  { id: 18, text: 'Make a mess of things.', factor: 'conscientiousness', sign: '-' },
  { id: 19, text: 'Seldom feel blue.', factor: 'emotional-stability', sign: '+' },
  { id: 20, text: 'Am not interested in abstract ideas.', factor: 'intellect-imagination', sign: '-' },
  { id: 21, text: 'Start conversations.', factor: 'extraversion', sign: '+' },
  { id: 22, text: "Am not interested in other people's problems.", factor: 'agreeableness', sign: '-' },
  { id: 23, text: 'Get chores done right away.', factor: 'conscientiousness', sign: '+' },
  { id: 24, text: 'Am easily disturbed.', factor: 'emotional-stability', sign: '-' },
  { id: 25, text: 'Have excellent ideas.', factor: 'intellect-imagination', sign: '+' },
  { id: 26, text: 'Have little to say.', factor: 'extraversion', sign: '-' },
  { id: 27, text: 'Have a soft heart.', factor: 'agreeableness', sign: '+' },
  { id: 28, text: 'Often forget to put things back where they belong.', factor: 'conscientiousness', sign: '-' },
  { id: 29, text: 'Get upset easily.', factor: 'emotional-stability', sign: '-' },
  { id: 30, text: 'Do not have a good imagination.', factor: 'intellect-imagination', sign: '-' },
  { id: 31, text: 'Talk to a lot of different people at parties.', factor: 'extraversion', sign: '+' },
  { id: 32, text: 'Am not really interested in others.', factor: 'agreeableness', sign: '-' },
  { id: 33, text: 'Like order.', factor: 'conscientiousness', sign: '+' },
  { id: 34, text: 'Change my mood a lot.', factor: 'emotional-stability', sign: '-' },
  { id: 35, text: 'Am quick to understand things.', factor: 'intellect-imagination', sign: '+' },
  { id: 36, text: "Don't like to draw attention to myself.", factor: 'extraversion', sign: '-' },
  { id: 37, text: 'Take time out for others.', factor: 'agreeableness', sign: '+' },
  { id: 38, text: 'Avoid my responsibilities.', factor: 'conscientiousness', sign: '-' },
  { id: 39, text: 'Have frequent mood swings.', factor: 'emotional-stability', sign: '-' },
  { id: 40, text: 'Use difficult words.', factor: 'intellect-imagination', sign: '+' },
  { id: 41, text: "Don't mind being the center of attention.", factor: 'extraversion', sign: '+' },
  { id: 42, text: "Feel others' emotions.", factor: 'agreeableness', sign: '+' },
  { id: 43, text: 'Follow a schedule.', factor: 'conscientiousness', sign: '+' },
  { id: 44, text: 'Get irritated easily.', factor: 'emotional-stability', sign: '-' },
  { id: 45, text: 'Spend time reflecting on things.', factor: 'intellect-imagination', sign: '+' },
  { id: 46, text: 'Am quiet around strangers.', factor: 'extraversion', sign: '-' },
  { id: 47, text: 'Make people feel at ease.', factor: 'agreeableness', sign: '+' },
  { id: 48, text: 'Am exacting in my work.', factor: 'conscientiousness', sign: '+' },
  { id: 49, text: 'Often feel blue.', factor: 'emotional-stability', sign: '-' },
  { id: 50, text: 'Am full of ideas.', factor: 'intellect-imagination', sign: '+' },
  { id: 1, text: 'Am the life of the party.', factor: 'extraversion', sign: '+' },
  { id: 2, text: 'Feel little concern for others.', factor: 'agreeableness', sign: '-' },
  { id: 3, text: 'Am always prepared.', factor: 'conscientiousness', sign: '+' },
  { id: 4, text: 'Get stressed out easily.', factor: 'emotional-stability', sign: '-' },
  { id: 5, text: 'Have a rich vocabulary.', factor: 'intellect-imagination', sign: '+' },
]

export const ITEMS_PER_PAGE = 5

// Instructions on page 0, trait test items on pages 1-10, and submit on page 11
export const LAST_PAGE = Math.ceil(items.length / ITEMS_PER_PAGE) + 1

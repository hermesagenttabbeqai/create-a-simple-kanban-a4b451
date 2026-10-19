export type Column = 'todo' | 'inprogress' | 'done'

export interface Card {
  id: string
  title: string
  description: string
  column: Column
  order: number
}

export interface BoardState {
  cards: Card[]
}

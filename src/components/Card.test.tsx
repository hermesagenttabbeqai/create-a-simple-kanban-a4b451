import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Card } from './Card'
import type { Card as CardType } from '../types'

const mockUpdateCard = vi.fn()
const mockDeleteCard = vi.fn()
const mockMoveCard = vi.fn()

vi.mock('../store', () => ({
  useStore: () => ({
    cards: [],
    addCard: vi.fn(),
    updateCard: mockUpdateCard,
    deleteCard: mockDeleteCard,
    moveCard: mockMoveCard,
    moveCardToColumn: vi.fn(),
  }),
}))

const baseCard: CardType = {
  id: 'card-1',
  title: 'Test Card',
  description: 'A test description',
  column: 'inprogress',
  order: 0,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Card', () => {
  it('renders card title', () => {
    render(<Card card={baseCard} />)
    expect(screen.getByTestId('card-title')).toHaveTextContent('Test Card')
  })

  it('renders description when non-empty', () => {
    render(<Card card={baseCard} />)
    expect(screen.getByTestId('card-description')).toHaveTextContent('A test description')
  })

  it('does not render description when empty', () => {
    render(<Card card={{ ...baseCard, description: '' }} />)
    expect(screen.queryByTestId('card-description')).toBeNull()
  })

  it('clicking edit shows input with current title', () => {
    render(<Card card={baseCard} />)
    fireEvent.click(screen.getByTestId('edit-button'))
    const input = screen.getByTestId('edit-input') as HTMLInputElement
    expect(input.value).toBe('Test Card')
  })

  it('saving edit calls updateCard', () => {
    render(<Card card={baseCard} />)
    fireEvent.click(screen.getByTestId('edit-button'))
    const input = screen.getByTestId('edit-input')
    fireEvent.change(input, { target: { value: 'Updated Title' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(mockUpdateCard).toHaveBeenCalledWith('card-1', { title: 'Updated Title' })
  })

  it('pressing Escape cancels edit', () => {
    render(<Card card={baseCard} />)
    fireEvent.click(screen.getByTestId('edit-button'))
    const input = screen.getByTestId('edit-input')
    fireEvent.change(input, { target: { value: 'Something else' } })
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(mockUpdateCard).not.toHaveBeenCalled()
    expect(screen.getByTestId('card-title')).toHaveTextContent('Test Card')
  })

  it('clicking delete calls deleteCard', () => {
    render(<Card card={baseCard} />)
    fireEvent.click(screen.getByTestId('delete-button'))
    expect(mockDeleteCard).toHaveBeenCalledWith('card-1')
  })

  it('clicking right arrow calls moveCard with right', () => {
    render(<Card card={baseCard} />)
    fireEvent.click(screen.getByTestId('move-right-button'))
    expect(mockMoveCard).toHaveBeenCalledWith('card-1', 'right')
  })

  it('left arrow disabled when column is todo', () => {
    render(<Card card={{ ...baseCard, column: 'todo' }} />)
    const btn = screen.getByTestId('move-left-button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('right arrow disabled when column is done', () => {
    render(<Card card={{ ...baseCard, column: 'done' }} />)
    const btn = screen.getByTestId('move-right-button') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })
})

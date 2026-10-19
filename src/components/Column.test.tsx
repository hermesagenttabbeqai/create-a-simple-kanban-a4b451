import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Column } from './Column'
import type { Card } from '../types'

const mockAddCard = vi.fn()

vi.mock('../store', () => ({
  useStore: () => ({
    cards: [],
    addCard: mockAddCard,
    updateCard: vi.fn(),
    deleteCard: vi.fn(),
    moveCard: vi.fn(),
    moveCardToColumn: vi.fn(),
  }),
}))

const sampleCards: Card[] = [
  { id: '1', title: 'First card', description: '', column: 'todo', order: 0 },
  { id: '2', title: 'Second card', description: 'desc', column: 'todo', order: 1 },
]

describe('Column', () => {
  beforeEach(() => {
    mockAddCard.mockClear()
  })

  it('renders column title', () => {
    render(<Column column="todo" title="To Do" cards={[]} />)
    expect(screen.getByText('To Do')).toBeTruthy()
  })

  it('renders all cards passed as props by card.title', () => {
    render(<Column column="todo" title="To Do" cards={sampleCards} />)
    expect(screen.getByText('First card')).toBeTruthy()
    expect(screen.getByText('Second card')).toBeTruthy()
  })

  it('submitting form with a title calls addCard with correct column', async () => {
    const user = userEvent.setup()
    render(<Column column="inprogress" title="In Progress" cards={[]} />)
    await user.type(screen.getByLabelText('Card title'), 'New task')
    await user.click(screen.getByRole('button', { name: 'Add card' }))
    expect(mockAddCard).toHaveBeenCalledTimes(1)
    expect(mockAddCard).toHaveBeenCalledWith('New task', '', 'inprogress')
  })

  it('submitting without a title does NOT call addCard', async () => {
    const user = userEvent.setup()
    render(<Column column="done" title="Done" cards={[]} />)
    await user.click(screen.getByRole('button', { name: 'Add card' }))
    expect(mockAddCard).not.toHaveBeenCalled()
  })

  it('shows validation error when title is empty', async () => {
    const user = userEvent.setup()
    render(<Column column="todo" title="To Do" cards={[]} />)
    await user.click(screen.getByRole('button', { name: 'Add card' }))
    expect(screen.getByText('Title is required')).toBeTruthy()
  })

  it('form clears after successful submit', async () => {
    const user = userEvent.setup()
    render(<Column column="todo" title="To Do" cards={[]} />)
    const titleInput = screen.getByLabelText('Card title') as HTMLInputElement
    const descTextarea = screen.getByLabelText('Description') as HTMLTextAreaElement
    await user.type(titleInput, 'My card')
    await user.type(descTextarea, 'My description')
    await user.click(screen.getByRole('button', { name: 'Add card' }))
    expect(titleInput.value).toBe('')
    expect(descTextarea.value).toBe('')
  })

  it('description textarea is limited to 200 chars', () => {
    render(<Column column="todo" title="To Do" cards={[]} />)
    const textarea = screen.getByLabelText('Description') as HTMLTextAreaElement
    expect(textarea.maxLength).toBe(200)
  })
})

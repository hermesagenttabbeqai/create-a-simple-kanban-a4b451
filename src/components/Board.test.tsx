import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Board } from './Board'

// Mock @dnd-kit/core
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    isDragging: false,
  }),
  useDroppable: () => ({
    setNodeRef: () => {},
    isOver: false,
  }),
}))

// Mock useStore
const mockMoveCardToColumn = vi.fn()
const mockCards = [
  { id: '1', title: 'Task One', description: '', column: 'todo' as const, order: 0 },
  { id: '2', title: 'Task Two', description: '', column: 'inprogress' as const, order: 0 },
  { id: '3', title: 'Task Three', description: '', column: 'done' as const, order: 0 },
  { id: '4', title: 'Task Four', description: '', column: 'todo' as const, order: 1 },
]

vi.mock('../store', () => ({
  useStore: () => ({
    cards: mockCards,
    addCard: vi.fn(),
    updateCard: vi.fn(),
    deleteCard: vi.fn(),
    moveCard: vi.fn(),
    moveCardToColumn: mockMoveCardToColumn,
  }),
}))

describe('Board', () => {
  beforeEach(() => {
    mockMoveCardToColumn.mockClear()
  })

  it('renders without error', () => {
    render(<Board />)
    expect(screen.getByText('Simple Kanban')).toBeInTheDocument()
  })

  it('renders 3 column headings', () => {
    render(<Board />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders card titles in correct columns', () => {
    render(<Board />)
    expect(screen.getByText('Task One')).toBeInTheDocument()
    expect(screen.getByText('Task Two')).toBeInTheDocument()
    expect(screen.getByText('Task Three')).toBeInTheDocument()
    expect(screen.getByText('Task Four')).toBeInTheDocument()
  })

  it('renders cards with data-card-id attributes', () => {
    render(<Board />)
    const card1 = document.querySelector('[data-card-id="1"]')
    const card2 = document.querySelector('[data-card-id="2"]')
    expect(card1).not.toBeNull()
    expect(card2).not.toBeNull()
  })

  it('renders 3 droppable columns with data-column attributes', () => {
    render(<Board />)
    expect(document.querySelector('[data-column="todo"]')).not.toBeNull()
    expect(document.querySelector('[data-column="inprogress"]')).not.toBeNull()
    expect(document.querySelector('[data-column="done"]')).not.toBeNull()
  })
})

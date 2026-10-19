import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStore } from './store'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(global, 'localStorage', { value: localStorageMock })

beforeEach(() => {
  localStorageMock.clear()
})

describe('useStore', () => {
  it('starts with empty cards', () => {
    const { result } = renderHook(() => useStore())
    expect(result.current.cards).toHaveLength(0)
  })

  it('addCard creates a card with the given title and column', () => {
    const { result } = renderHook(() => useStore())
    act(() => {
      result.current.addCard('My task', '', 'todo')
    })
    expect(result.current.cards).toHaveLength(1)
    expect(result.current.cards[0].title).toBe('My task')
    expect(result.current.cards[0].column).toBe('todo')
  })

  it('addCard truncates description to 200 chars', () => {
    const { result } = renderHook(() => useStore())
    const long = 'x'.repeat(300)
    act(() => {
      result.current.addCard('Title', long, 'todo')
    })
    expect(result.current.cards[0].description).toHaveLength(200)
  })

  it('updateCard changes title', () => {
    const { result } = renderHook(() => useStore())
    act(() => {
      result.current.addCard('Old title', '', 'todo')
    })
    const id = result.current.cards[0].id
    act(() => {
      result.current.updateCard(id, { title: 'New title' })
    })
    expect(result.current.cards[0].title).toBe('New title')
  })

  it('deleteCard removes the card', () => {
    const { result } = renderHook(() => useStore())
    act(() => {
      result.current.addCard('To delete', '', 'todo')
    })
    const id = result.current.cards[0].id
    act(() => {
      result.current.deleteCard(id)
    })
    expect(result.current.cards).toHaveLength(0)
  })

  it('moveCard moves card from todo to inprogress', () => {
    const { result } = renderHook(() => useStore())
    act(() => {
      result.current.addCard('Move me', '', 'todo')
    })
    const id = result.current.cards[0].id
    act(() => {
      result.current.moveCard(id, 'right')
    })
    expect(result.current.cards[0].column).toBe('inprogress')
  })

  it('moveCard does not move beyond done', () => {
    const { result } = renderHook(() => useStore())
    act(() => {
      result.current.addCard('Already done', '', 'done')
    })
    const id = result.current.cards[0].id
    act(() => {
      result.current.moveCard(id, 'right')
    })
    expect(result.current.cards[0].column).toBe('done')
  })

  it('persists state to localStorage', () => {
    const { result } = renderHook(() => useStore())
    act(() => {
      result.current.addCard('Persisted', '', 'todo')
    })
    const raw = localStorageMock.getItem('kanban-state')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw!)
    expect(parsed.cards[0].title).toBe('Persisted')
  })

  it('loads state from localStorage on mount', () => {
    localStorageMock.setItem('kanban-state', JSON.stringify({
      cards: [{ id: 'abc', title: 'Loaded', description: '', column: 'inprogress', order: 0 }]
    }))
    const { result } = renderHook(() => useStore())
    expect(result.current.cards[0].title).toBe('Loaded')
  })
})

import { useState, useEffect } from 'react'
import type { Card, Column, BoardState } from './types'

const STORAGE_KEY = 'kanban-state'

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function loadState(): BoardState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { cards: [] }
    const parsed = JSON.parse(raw) as BoardState
    if (!Array.isArray(parsed.cards)) return { cards: [] }
    return parsed
  } catch {
    return { cards: [] }
  }
}

function saveState(state: BoardState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export interface StoreActions {
  cards: Card[]
  addCard: (title: string, description: string, column: Column) => void
  updateCard: (id: string, updates: Partial<Pick<Card, 'title' | 'description'>>) => void
  deleteCard: (id: string) => void
  moveCard: (id: string, direction: 'left' | 'right') => void
  moveCardToColumn: (id: string, column: Column, afterId?: string) => void
}

const COLUMN_ORDER: Column[] = ['todo', 'inprogress', 'done']

export function useStore(): StoreActions {
  const [cards, setCards] = useState<Card[]>(() => loadState().cards)

  useEffect(() => {
    saveState({ cards })
  }, [cards])

  function addCard(title: string, description: string, column: Column): void {
    const sameColumn = cards.filter(c => c.column === column)
    const order = sameColumn.length
    const newCard: Card = {
      id: generateId(),
      title: title.trim(),
      description: description.trim().slice(0, 200),
      column,
      order,
    }
    setCards(prev => [...prev, newCard])
  }

  function updateCard(id: string, updates: Partial<Pick<Card, 'title' | 'description'>>): void {
    setCards(prev =>
      prev.map(c => {
        if (c.id !== id) return c
        return {
          ...c,
          title: updates.title !== undefined ? updates.title.trim() : c.title,
          description: updates.description !== undefined
            ? updates.description.trim().slice(0, 200)
            : c.description,
        }
      })
    )
  }

  function deleteCard(id: string): void {
    setCards(prev => prev.filter(c => c.id !== id))
  }

  function moveCard(id: string, direction: 'left' | 'right'): void {
    const card = cards.find(c => c.id === id)
    if (!card) return
    const currentIndex = COLUMN_ORDER.indexOf(card.column)
    const nextIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1
    if (nextIndex < 0 || nextIndex >= COLUMN_ORDER.length) return
    const targetColumn = COLUMN_ORDER[nextIndex]
    const targetCount = cards.filter(c => c.column === targetColumn).length
    setCards(prev =>
      prev.map(c => {
        if (c.id !== id) return c
        return { ...c, column: targetColumn, order: targetCount }
      })
    )
  }

  function moveCardToColumn(id: string, column: Column, afterId?: string): void {
    setCards(prev => {
      const card = prev.find(c => c.id === id)
      if (!card || card.column === column) return prev
      const targetCards = prev.filter(c => c.column === column)
      let newOrder = targetCards.length
      if (afterId) {
        const after = targetCards.find(c => c.id === afterId)
        if (after) newOrder = after.order + 1
      }
      return prev.map(c => {
        if (c.id !== id) return c
        return { ...c, column, order: newOrder }
      })
    })
  }

  return { cards, addCard, updateCard, deleteCard, moveCard, moveCardToColumn }
}

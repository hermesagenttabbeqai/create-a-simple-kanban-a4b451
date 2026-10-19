import { useState } from 'react'
import { useStore } from '../store'
import type { Card, Column } from '../types'

interface ColumnProps {
  column: Column
  title: string
  cards: Card[]
}

const headerColorVar: Record<Column, string> = {
  todo: 'var(--color-col-todo)',
  inprogress: 'var(--color-col-inprogress)',
  done: 'var(--color-col-done)',
}

export function Column({ column, title, cards }: ColumnProps) {
  const { addCard } = useStore()
  const [cardTitle, setCardTitle] = useState('')
  const [description, setDescription] = useState('')
  const [titleError, setTitleError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cardTitle.trim()) {
      setTitleError('Title is required')
      return
    }
    addCard(cardTitle.trim(), description, column)
    setCardTitle('')
    setDescription('')
    setTitleError('')
  }

  return (
    <div className="column">
      <div
        className="column-header"
        style={{ backgroundColor: headerColorVar[column] }}
      >
        <h2>{title}</h2>
      </div>
      <div className="column-cards">
        {cards.map(card => (
          <div key={card.id} className="card-placeholder">
            {card.title}
          </div>
        ))}
      </div>
      <form className="add-card-form" onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          value={cardTitle}
          onChange={e => {
            setCardTitle(e.target.value)
            if (titleError) setTitleError('')
          }}
          placeholder="Card title"
          maxLength={100}
          aria-label="Card title"
        />
        {titleError && <span className="error">{titleError}</span>}
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
          maxLength={200}
          aria-label="Description"
        />
        <button type="submit">Add card</button>
      </form>
    </div>
  )
}

import { useState, useRef, KeyboardEvent } from 'react'
import type { Card as CardType } from '../types'
import { useStore } from '../store'

interface CardProps {
  card: CardType
}

export function Card({ card }: CardProps) {
  const { updateCard, deleteCard, moveCard } = useStore()
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setEditTitle(card.title)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function saveEdit() {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== card.title) {
      updateCard(card.id, { title: trimmed })
    }
    setEditing(false)
  }

  function cancelEdit() {
    setEditTitle(card.title)
    setEditing(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const cardStyle: React.CSSProperties = {
    background: 'var(--color-surface, #fff)',
    color: 'var(--color-text, #111)',
    border: '1px solid var(--color-border, #e0e0e0)',
    borderRadius: 'var(--radius, 6px)',
    padding: 'var(--space, 12px)',
    marginBottom: 'var(--space, 12px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }

  const buttonStyle: React.CSSProperties = {
    cursor: 'pointer',
    padding: '2px 8px',
    borderRadius: 'var(--radius, 4px)',
    border: '1px solid var(--color-border, #ccc)',
    background: 'transparent',
    color: 'var(--color-text, #111)',
    fontSize: '0.85em',
  }

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    color: 'var(--color-primary, #0070f3)',
    borderColor: 'var(--color-primary, #0070f3)',
  }

  const dangerButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    color: 'var(--color-danger, #e53e3e)',
    borderColor: 'var(--color-danger, #e53e3e)',
  }

  return (
    <div style={cardStyle} data-testid="card">
      {editing ? (
        <input
          ref={inputRef}
          data-testid="edit-input"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            padding: '4px',
            borderRadius: 'var(--radius, 4px)',
            border: '1px solid var(--color-primary, #0070f3)',
            color: 'var(--color-text, #111)',
            background: 'var(--color-surface, #fff)',
          }}
        />
      ) : (
        <div data-testid="card-title" style={{ fontWeight: 600 }}>
          {card.title}
        </div>
      )}

      {card.description && !editing && (
        <div
          data-testid="card-description"
          style={{ color: 'var(--color-text-muted, #666)', fontSize: '0.9em' }}
        >
          {card.description}
        </div>
      )}

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {!editing && (
          <button
            data-testid="edit-button"
            style={primaryButtonStyle}
            onClick={startEdit}
          >
            Edit
          </button>
        )}

        <button
          data-testid="delete-button"
          style={dangerButtonStyle}
          onClick={() => deleteCard(card.id)}
        >
          Delete
        </button>

        <button
          data-testid="move-left-button"
          style={buttonStyle}
          onClick={() => moveCard(card.id, 'left')}
          disabled={card.column === 'todo'}
          aria-label="Move left"
        >
          ←
        </button>

        <button
          data-testid="move-right-button"
          style={buttonStyle}
          onClick={() => moveCard(card.id, 'right')}
          disabled={card.column === 'done'}
          aria-label="Move right"
        >
          →
        </button>
      </div>
    </div>
  )
}

import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { useDroppable, useDraggable } from '@dnd-kit/core'
import { useStore } from '../store'
import type { Column, Card } from '../types'

interface ColumnDef {
  key: Column
  label: string
}

const COLUMNS: ColumnDef[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

interface DraggableCardProps {
  card: Card
}

function DraggableCard({ card }: DraggableCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  })

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    padding: '8px 12px',
    marginBottom: '8px',
    background: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    cursor: 'grab',
    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-card-id={card.id}
      {...listeners}
      {...attributes}
    >
      {card.title}
    </div>
  )
}

interface DroppableColumnProps {
  column: ColumnDef
  cards: Card[]
}

function DroppableColumn({ column, cards }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.key })

  const style: React.CSSProperties = {
    flex: '1 1 0',
    minWidth: '220px',
    background: isOver ? '#eff6ff' : '#f3f4f6',
    border: isOver ? '2px dashed #3b82f6' : '2px dashed transparent',
    borderRadius: '8px',
    padding: '12px',
  }

  return (
    <div ref={setNodeRef} style={style} data-column={column.key}>
      <h2 style={{ marginTop: 0, marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>
        {column.label}
      </h2>
      {cards.map(card => (
        <DraggableCard key={card.id} card={card} />
      ))}
    </div>
  )
}

export function Board() {
  const { cards, moveCardToColumn } = useStore()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const cardId = active.id as string
    const targetColumn = over.id as Column
    moveCardToColumn(cardId, targetColumn)
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Simple Kanban</h1>
      <DndContext onDragEnd={handleDragEnd}>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            minWidth: '768px',
          }}
        >
          {COLUMNS.map(col => (
            <DroppableColumn
              key={col.key}
              column={col}
              cards={cards
                .filter(c => c.column === col.key)
                .sort((a, b) => a.order - b.order)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  )
}

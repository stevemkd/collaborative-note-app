'use client'

import { Card, Button } from '@heroui/react'
import { FileText, Clock, Pin, History, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Note } from '@/types/note'
import { memo } from 'react'

interface NotesListProps {
  notes?: Note[]
  onSelect: (note: Note) => void
  onCreate: () => void
  onDelete: (noteId: string) => void
}

export default memo(function NotesList({
  notes = [],
  onSelect,
  onCreate,
  onDelete
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-3">
          <FileText className="text-muted-foreground" size={24} />
        </div>
        <h3 className="font-semibold text-foreground">No notes yet</h3>
        <p className="text-sm text-muted-foreground mb-4">Create your first note to get started</p>
        <Button
          color="primary"
          variant="flat"
          size="sm"
          onPress={onCreate}
          className="font-semibold"
        >
          Create Note
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-140px)] pr-2 custom-scrollbar">
      {notes.map((note) => (
        <div key={note.id} className="relative group">
          <Card
            className="hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border p-3 rounded-lg cursor-pointer bg-transparent shadow-none group active:scale-[0.98]"
            onPress={() => onSelect(note)}
            isPressable
            isHoverable
            radius="sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  <h4 className="font-medium truncate text-foreground text-sm">{note.title}</h4>
                  {note.pinned && <Pin size={12} className="text-warning flex-shrink-0 fill-warning" />}
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2 mb-3 pl-6 font-normal leading-relaxed">
                  {note.content.replace(/<[^>]+>/g, ' ').slice(0, 80)}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground pl-6 uppercase tracking-wide font-medium">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{format(new Date(note.updatedAt), 'MMM dd')}</span>
                  </div>
                  {note.versions && note.versions.length > 0 && (
                    <div className="flex items-center gap-1">
                      <History size={12} />
                      <span>v{note.versions.length}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <div
              className="p-1.5 hover:bg-background/80 rounded-md cursor-pointer text-muted-foreground hover:text-destructive transition-colors shadow-sm border border-transparent hover:border-border"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(note.id);
              }}
            >
              <Trash2 size={14} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})

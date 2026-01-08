'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, Button, Tooltip, Input, Chip } from '@heroui/react'
import { Save, Clock, RotateCcw, Edit2, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import { useEditor, EditorContent } from '@tiptap/react'

// ✅ ALL STATIC IMPORTS
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Blockquote from '@tiptap/extension-blockquote'

import MenuBar from './MenuBar'
import { Note } from '@/types/note'
import ConfirmationModal from './ConfirmationModal'

interface NoteEditorProps {
  note: Note
  onSave: (content: string) => void

  onTitleChange?: (title: string) => void
  collaborators?: string[]
}

export default function NoteEditor({ note, onSave, onTitleChange, collaborators }: NoteEditorProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [editedTitle, setEditedTitle] = useState(note.title)
  const titleInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      // ✅ Disable conflicting nodes
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),

      // ✅ Your exact MenuBar features
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),

      // ✅ Lists & Blocks
      BulletList,
      OrderedList,
      Blockquote,
    ],
    content: note.content,
    editorProps: {
      attributes: {
        class: 'prose prose-2xl max-w-none focus:outline-none min-h-[400px] p-6 sm:p-8 leading-relaxed prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:mb-4 prose-headings:mt-8 prose-headings:text-foreground/95 prose-h1:text-4xl prose-h1:font-black prose-h1:!leading-tight prose-h2:text-3xl prose-h2:font-bold prose-h3:text-2xl prose-h3:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:font-semibold prose-code:bg-muted/70 prose-code:px-2.5 prose-code:py-1 prose-code:rounded-lg prose-code:font-mono prose-blockquote:pl-6 prose-blockquote:border-l-4 prose-blockquote:border-primary/30 prose-blockquote:italic prose-blockquote:font-medium prose-ol:pl-8 prose-ul:pl-8 prose-li:marker:text-primary/70 prose-li:marker:font-bold',
      },
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (editor && mounted && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content)
    }
  }, [note.content, editor, mounted])

  useEffect(() => {
    setEditedTitle(note.title)
  }, [note.title])

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])



  const handleSave = async () => {
    if (!editor) return
    setIsSaving(true)
    try {
      await onSave(editor.getHTML())
    } finally {
      setIsSaving(false)
    }
  }

  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== note.title && onTitleChange) {
      onTitleChange(editedTitle.trim())
    }
    setIsEditingTitle(false)
  }

  const handleTitleCancel = () => {
    setEditedTitle(note.title)
    setIsEditingTitle(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTitleSave()
    } else if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }

  if (!mounted || !editor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl animate-spin" />
          </div>
          <div className="h-96 w-full max-w-4xl bg-default-100 rounded-3xl animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] relative">
      {/* Helper header / Meta info */}
      <div className="flex items-center justify-between px-8 py-3 bg-background border-b border-border shrink-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={12} />
          <span>Last edited {format(new Date(note.updatedAt), 'MMM dd, h:mm a')}</span>
          {collaborators?.length ? (
            <>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="text-success font-medium">{collaborators.length} active</span>
            </>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="light"
            color="danger"
            onPress={() => {
              if (editor) {
                setShowResetConfirm(true)
              }
            }}
            startContent={<RotateCcw size={14} />}
            className="h-8 text-xs font-medium"
          >
            Reset
          </Button>
          <Button
            color="primary"
            size="sm"
            onPress={handleSave}
            isLoading={isSaving}
            startContent={!isSaving ? <Save size={14} /> : undefined}
            className="h-8 px-4 text-xs font-semibold rounded-md shadow-sm"
            radius="sm"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="px-8 pt-8 pb-4 bg-background shrink-0 max-w-4xl mx-auto w-full">
          {isEditingTitle ? (
            <Input
              ref={titleInputRef}
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              size="lg"
              variant="underlined"
              className="text-4xl font-bold w-full"
              classNames={{
                input: "text-4xl font-bold py-2 text-foreground",
              }}
              endContent={
                <div className="flex gap-1">
                  <Button isIconOnly size="sm" color="success" variant="light" onPress={handleTitleSave}><Check size={16} /></Button>
                  <Button isIconOnly size="sm" color="danger" variant="light" onPress={handleTitleCancel}><X size={16} /></Button>
                </div>
              }
            />
          ) : (
            <div className="group flex items-center gap-2">
              <h1
                className="text-4xl font-bold text-foreground cursor-text outline-none decoration-none"
                onClick={() => setIsEditingTitle(true)}
              >
                {note.title}
              </h1>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-muted-foreground"
                onPress={() => setIsEditingTitle(true)}
              >
                <Edit2 size={14} />
              </Button>
            </div>
          )}
        </div>

        {/* Toolbar - Sticky */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-y border-border px-8 py-2 flex justify-center">
          <div className="max-w-4xl w-full">
            <MenuBar editor={editor} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 py-8 min-h-[500px]">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          if (editor) {
            editor.commands.setContent(note.content)
          }
        }}
        title="Reset Changes"
        description="Are you sure you want to discard all current changes? This action cannot be undone."
        confirmText="Reset"
      />
    </div>
  )
}
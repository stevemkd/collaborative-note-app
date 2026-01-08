// store/notesStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Note } from '@/types/note'

interface NotesStore {
  notes: Note[]
  selectedNote: Note | null
  collaborators: string[]
  setSelectedNote: (note: Note | null) => void
  createNote: (title: string) => Promise<void>
  updateNote: (noteId: string, content: string, title?: string) => Promise<void>
  updateNoteTitle: (noteId: string, title: string) => Promise<void>
  deleteNote: (noteId: string) => Promise<void>
  restoreVersion: (noteId: string, versionId: string) => Promise<void>
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notes: [
        {
          id: '1',
          title: 'Welcome to CollabNotes',
          content: '<h1>Welcome!</h1><p>Start collaborating with your team in real-time.</p>',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
          versions: [],
        },
      ],
      selectedNote: null,
      collaborators: ['Alice', 'Bob', 'Charlie'],

      setSelectedNote: (note) => set({ selectedNote: note }),

      createNote: async (title) => {
        const newNote: Note = {
          id: crypto.randomUUID(),
          title,
          content: '<p>Start writing here...</p>',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: [],
          versions: [],
        }
        set((state) => ({
          notes: [newNote, ...state.notes],
          selectedNote: newNote,
        }))
      },

      // Update note content AND title
      updateNote: async (noteId: string, content: string, title?: string) => {
        set((state) => {
          const updatedNotes = state.notes.map((note) =>
            note.id === noteId
              ? {
                ...note,
                title: title || note.title,
                content,
                updatedAt: new Date().toISOString(),
                versions: [
                  ...note.versions,
                  {
                    id: crypto.randomUUID(),
                    content,
                    createdAt: new Date().toISOString(),
                    author: 'You', // Simulated author
                  },
                ],
              }
              : note
          )

          // Also update selectedNote if it matches
          const updatedSelectedNote =
            state.selectedNote?.id === noteId
              ? updatedNotes.find((n) => n.id === noteId) || null
              : state.selectedNote

          return {
            notes: updatedNotes,
            selectedNote: updatedSelectedNote,
          }
        })
      },

      // Update only the title
      updateNoteTitle: async (noteId: string, title: string) => {
        set((state) => {
          const updatedNotes = state.notes.map((note) =>
            note.id === noteId
              ? {
                ...note,
                title,
                updatedAt: new Date().toISOString(),
              }
              : note
          )

          const updatedSelectedNote =
            state.selectedNote?.id === noteId
              ? updatedNotes.find((n) => n.id === noteId) || null
              : state.selectedNote

          return {
            notes: updatedNotes,
            selectedNote: updatedSelectedNote,
          }
        })
      },

      deleteNote: async (noteId: string) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
          selectedNote:
            state.selectedNote?.id === noteId ? null : state.selectedNote,
        }))
      },

      restoreVersion: async (noteId: string, versionId: string) => {
        set((state) => {
          const note = state.notes.find((n) => n.id === noteId)
          const version = note?.versions.find((v) => v.id === versionId)

          if (!note || !version) return state

          const updatedNotes = state.notes.map((n) =>
            n.id === noteId
              ? {
                ...n,
                content: version.content,
                updatedAt: new Date().toISOString(),
                versions: [
                  ...n.versions,
                  {
                    id: crypto.randomUUID(),
                    content: version.content,
                    createdAt: new Date().toISOString(),
                    author: 'You', // Simulated author on restore
                  },
                ],
              }
              : n
          )

          const updatedSelectedNote =
            state.selectedNote?.id === noteId
              ? updatedNotes.find((n) => n.id === noteId) || null
              : state.selectedNote

          return {
            notes: updatedNotes,
            selectedNote: updatedSelectedNote,
          }
        })
      },
    }),
    {
      name: 'collab-notes-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ notes: state.notes }), // Only persist notes, not transient UI state like selectedNote? keeping selectedNote might be nice though. Let's persist all for now. actually, persisting selectedNote might cause issues if that note is deleted or stale, but let's try persisting all for "session restore".
    }
  )
)

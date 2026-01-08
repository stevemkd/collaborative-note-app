export interface NoteVersion {
  id: string
  content: string
  createdAt: string
  author: string
}

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
  versions: NoteVersion[]
  collaborators?: number
  pinned?: boolean
}
import { useEffect, useState } from 'react'

interface CollaborationEvent {
  type: 'edit' | 'cursor' | 'presence'
  noteId: string
  userId: string
  data: any
  timestamp: number
}

export function useCollaboration(noteId?: string) {
  const [users, setUsers] = useState<string[]>([])
  const [lastEvent, setLastEvent] = useState<CollaborationEvent | null>(null)

  useEffect(() => {
    if (!noteId) return

    // Simulate WebSocket connection
    const simulateCollaboration = () => {
      const mockUsers = ['Alice', 'Bob', 'Charlie', 'David']
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
      
      const event: CollaborationEvent = {
        type: Math.random() > 0.7 ? 'cursor' : 'edit',
        noteId,
        userId: randomUser,
        data: { position: Math.floor(Math.random() * 100) },
        timestamp: Date.now()
      }

      setLastEvent(event)
      
      // Update active users
      const activeUsers = [randomUser]
      if (Math.random() > 0.5) {
        activeUsers.push(mockUsers.filter(u => u !== randomUser)[0])
      }
      setUsers(activeUsers)
    }

    const interval = setInterval(simulateCollaboration, 3000)
    return () => clearInterval(interval)
  }, [noteId])

  return { users, lastEvent }
}
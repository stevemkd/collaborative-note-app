'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, Button, Chip, Avatar, Badge, AvatarGroup, Spacer, Skeleton } from '@heroui/react'
import { toast, Toaster } from 'react-hot-toast'
import {
  Users, History, Layout, FileText, PanelLeftClose, PanelLeftOpen,
  Plus, Search, Sparkles, Globe, Zap, Rocket, TrendingUp,
  Bell, Settings, Shield, Clock, Cloud,
  MessageSquare, BarChart, Lock, Eye, Star, Upload
} from 'lucide-react'
import NotesList from '@/components/NotesList'
import dynamic from 'next/dynamic'
import VersionHistory from '@/components/VersionHistory'
import { useNotesStore } from '@/store/notesStore'
import { NoteVersion } from '@/types/note'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'
import ConfirmationModal from '@/components/ConfirmationModal'

const NoteEditor = dynamic(() => import('@/components/NoteEditor'), {
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
      </div>
      <p className="text-sm text-default-500 font-medium animate-pulse">Loading editor...</p>
    </div>
  ),
  ssr: false
})

export default function Home() {
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [stats, setStats] = useState({
    totalNotes: 0,
    collaborators: 0,
    lastActive: '2 min ago'
  })

  const {
    notes = [],
    selectedNote,
    createNote,
    updateNote,
    updateNoteTitle,
    deleteNote,
    restoreVersion,
    setSelectedNote,
    collaborators = []
  } = useNotesStore()

  const [searchQuery, setSearchQuery] = useState('')

  // Stats animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalNotes: notes.length,
        collaborators: collaborators.length || 0,
        lastActive: 'Just now'
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [notes.length, collaborators.length])

  // Filter notes based on search query
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateNote = async () => {
    setIsCreating(true)
    try {
      const title = `Untitled Note ${notes.length + 1}`
      await createNote(title)
      toast.success('✨ Note created successfully!')
      
      // Mobile sidebar auto close
      if (window.innerWidth < 768) setMobileSidebarOpen(false)
    } catch (error) {
      toast.error('Failed to create note')
    } finally {
      setIsCreating(false)
    }
  }

  const handleSaveNote = async (content: string) => {
    if (!selectedNote) return
    try {
      await updateNote(selectedNote.id, content)
      toast.success('💾 Saved successfully!', {
        icon: '✅',
        style: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      })
    } catch (error) {
      toast.error('Failed to save')
    }
  }

  const handleTitleChange = async (newTitle: string) => {
    if (!selectedNote) return

    try {
      await updateNoteTitle(selectedNote.id, newTitle)
      toast.success('📝 Title updated!')
    } catch (error) {
      toast.error('Failed to update title')
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    setNoteToDelete(noteId)
  }

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return

    try {
      await deleteNote(noteToDelete)
      if (selectedNote?.id === noteToDelete) setSelectedNote(null)
      toast.success('🗑️ Note moved to trash')
      setNoteToDelete(null)
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

  const handleSelectNote = (note: any) => {
    setSelectedNote(note)
    if (mobileSidebarOpen) setMobileSidebarOpen(false)
  }

  const handleRestoreVersion = async (version: NoteVersion) => {
    if (!selectedNote) return
    await restoreVersion(selectedNote.id, version.id)
    setShowVersionHistory(false)
    toast.success('🔄 Version restored!')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-default-50/20 text-foreground overflow-hidden">
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }}
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Minimal Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-backdrop-blur:bg-background/60 sticky top-0 z-50 h-16 flex items-center justify-center"
      >
        <div className="max-w-[1400px] w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl text-default-600 hover:bg-default-100/50 transition-all md:hidden border border-default-200/50"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <PanelLeftOpen size={22} />
            </motion.button>

            {/* Logo/Brand */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 p-3 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-2xl border border-primary/20 shadow-lg shadow-primary/5"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-30 rounded-full" />
                <Layout size={28} className="relative text-primary drop-shadow-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-secondary">
                  CollabNotes
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-xs text-default-600 font-medium">Live</p>
                  </div>
                  <p className="text-xs text-default-500">• Real-time collaboration</p>
                </div>
              </div>
            </motion.div>

            {/* Stats Badges */}
            <div className="hidden lg:flex items-center gap-3 ml-6">
              <Badge 
                variant="flat" 
                color="primary" 
                size="sm"
                className="backdrop-blur-sm border border-primary/20"
              >
                <FileText size={14} className="mr-2" />
                <span className="font-bold">{stats.totalNotes}</span> notes
              </Badge>
             <Badge 
  variant="flat" 
  color="success" 
  size="sm"
  className="backdrop-blur-sm border border-success/20"
>
  <Users size={14} className="mr-2" />
  <span className="font-bold">{stats.collaborators}</span> online
</Badge>
              <Badge 
                variant="flat" 
                color="warning" 
                size="sm"
                className="backdrop-blur-sm border border-warning/20"
              >
                <Clock size={14} className="mr-2" />
                Active {stats.lastActive}
              </Badge>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative group">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <div className="relative flex items-center h-11 px-4 bg-default-100/30 backdrop-blur-sm rounded-xl border border-default-200/50 group-hover:border-primary/50 transition-all duration-300">
                <Search size={18} className="text-default-500 mr-3" />
                <input
                  type="text"
                  placeholder="Search notes, tags, content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm w-48 lg:w-64 placeholder:text-default-400 font-medium"
                />
                <kbd className="ml-3 text-xs text-default-400 hidden xl:inline px-2 py-1 rounded bg-default-200/50">⌘K</kbd>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
               
              </motion.div>
             
              
            </div>

            {/* History Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="light"
                isIconOnly
                onPress={() => setShowVersionHistory(true)}
                className="text-default-600 hover:text-primary hover:bg-primary/10 rounded-xl"
              >
                <History size={22} />
              </Button>
            </motion.div>

            {/* New Note Button */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ["0 0 20px rgba(59, 130, 246, 0.3)", "0 0 40px rgba(59, 130, 246, 0.5)", "0 0 20px rgba(59, 130, 246, 0.3)"]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Button
                color="primary"
                className="font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                startContent={isCreating ? undefined : <Sparkles size={18} />}
                onPress={handleCreateNote}
                isLoading={isCreating}
                
                size="lg"
              >
                <span className="hidden lg:inline">New Note</span>
                <Plus size={20} className="lg:hidden" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex md:flex-row gap-8 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed inset-y-0 left-0 z-50 w-80 bg-background/95 backdrop-blur-xl border-r border-divider/50 shadow-2xl md:hidden"
              >
                <div className="h-20 flex items-center justify-between px-6 border-b border-divider/50 bg-gradient-to-r from-background via-background to-background/80">
                  <div>
                    <span className="font-bold text-base bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                      Your Workspace
                    </span>
                    <p className="text-xs text-default-500 mt-1">{notes.length} notes</p>
                  </div>
                  <Button
                    size="sm"
                    variant="light"
                    isIconOnly
                    onPress={() => setMobileSidebarOpen(false)}
                    className="hover:bg-default-100/50 rounded-xl"
                  >
                    <PanelLeftClose size={20} />
                  </Button>
                </div>
                <NotesList
                  notes={notes}
                  onSelect={handleSelectNote}
                  onCreate={handleCreateNote}
                  onDelete={handleDeleteNote}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden md:block w-80 flex-shrink-0 border-r border-border/50 bg-background/30 backdrop-blur-sm h-[calc(100vh-5rem)] rounded-3xl"
        >
          <div className="h-full p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">All Notes</h2>
             
            </div>
            <div className="flex-1 overflow-hidden">
              <NotesList
                notes={filteredNotes}
                onSelect={handleSelectNote}
                onCreate={handleCreateNote}
                onDelete={handleDeleteNote}
              />
            </div>
            
            {/* Sidebar Footer Stats */}
            <div className="mt-6 pt-6 border-t border-divider/50">
              <div className="grid grid-cols-2 gap-3">
                
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editor Area */}
        <div className="flex-1 min-h-0 flex flex-col">
          <AnimatePresence mode="wait">
            {selectedNote ? (
              <motion.div
                key={selectedNote.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                {/* Editor Header */}
                <div className="flex items-center justify-between mb-8 p-4 rounded-2xl bg-gradient-to-r from-default-100/20 via-background to-default-100/20 border border-default-200/30 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <AvatarGroup size="md" max={3} isBordered>
                      {collaborators?.map((collab, index) => (
                        <Avatar
                          key={index}
                          size="md"
                          classNames={{
                            base: "ring-2 ring-background shadow-lg",
                          }}
                        />
                      ))}
                    </AvatarGroup>
                    <div>
                      <p className="text-sm text-default-500 font-medium">Collaborating with</p>
                      <p className="font-bold">{collaborators.length || 0} people online</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="light"
                      size="sm"
                      className="font-medium"
                      startContent={<Cloud size={16} />}
                    >
                      Synced
                    </Button>
                    <Button
                      variant="flat"
                      size="sm"
                      color="primary"
                      className="font-bold"
                      startContent={<Shield size={16} />}
                    >
                      Protected
                    </Button>
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 border border-default-200/30 rounded-2xl overflow-hidden shadow-xl">
                  <NoteEditor
                    note={selectedNote}
                    onSave={handleSaveNote}
                    onTitleChange={handleTitleChange}
                    collaborators={collaborators}
                  />
                </div>

                {/* Editor Footer */}
                <div className="mt-6 flex items-center justify-between text-sm text-default-500">
                  <div className="flex items-center gap-4">
                    
                    <div className="flex items-center gap-2">
                      <Eye size={14} />
                     
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-yellow-500" />
                    <span>Version {selectedNote.versions?.length || 1}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex items-center justify-center p-8"
              >
                <Card className="max-w-4xl w-full border-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden">
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                  
                  <div className="relative p-16">
                    <div className="text-center">
                      {/* Animated Icon */}
                      <div className="relative inline-block mb-12">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-3xl opacity-30 rounded-full animate-pulse" />
                        <div className="relative w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border border-primary/20">
                          <FileText size={80} className="text-primary" />
                          <div className="absolute -top-4 -right-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                              <Sparkles size={32} className="text-white" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <h2 className="text-5xl font-black mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                        Welcome to CollabNotes
                      </h2>
                      <p className="text-default-600 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
                        The ultimate workspace for real-time collaboration. Create, edit, and share notes with your team seamlessly.
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="lg"
                            color="primary"
                            className="font-bold shadow-2xl shadow-primary/30 h-14 px-8 rounded-xl"
                            startContent={<Sparkles size={22} />}
                            onPress={handleCreateNote}
                            isLoading={isCreating}
                          >
                            Create New Note
                          </Button>
                        </motion.div>
                      
                      </div>

                      {/* Features Grid */}
                      <div className="grid md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-divider/50">
                        {[
                          { icon: MessageSquare, title: "Real-time Chat", desc: "Live collaboration with team chat", color: "text-primary" },
                          { icon: BarChart, title: "Version History", desc: "Track every change made", color: "text-secondary" },
                          { icon: Lock, title: "End-to-End Encrypted", desc: "Military grade security", color: "text-success" },
                         
                         
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="text-center p-6 rounded-2xl bg-gradient-to-b from-default-100/30 to-transparent border border-default-200/30 hover:border-primary/30 transition-all"
                          >
                            <div className={`w-14 h-14 ${feature.color}/10 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                              <feature.icon size={28} className={feature.color} />
                            </div>
                            <p className="font-bold text-lg mb-2">{feature.title}</p>
                            <p className="text-sm text-default-500">{feature.desc}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {selectedNote && (
        <VersionHistory
          versions={selectedNote.versions || []}
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          onRestore={handleRestoreVersion}
        />
      )}

      <ConfirmationModal
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        onConfirm={confirmDeleteNote}
        title="Delete Note"
        description="This note will be moved to trash. All content and history will be permanently deleted after 30 days."
        confirmText="Delete Forever"
        cancelText="Cancel"
        icon="danger"
        loading={false}
      />
    </div>
  )
}
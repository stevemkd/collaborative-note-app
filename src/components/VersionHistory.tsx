// src/components/VersionHistory.tsx - ✅ FIXED
'use client'

import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Spacer
} from '@heroui/react'
import { History, RefreshCw, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface VersionHistoryProps {
  versions: any[]
  isOpen: boolean
  onClose: () => void
  onRestore: (version: any) => void
}

export default function VersionHistory({ versions, isOpen, onClose, onRestore }: VersionHistoryProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        wrapper: "p-4",
        backdrop: "bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60",
        base: "bg-gradient-to-br from-background via-background to-background/95 border border-default-200/50 shadow-2xl shadow-black/30 max-w-6xl",
        header: "border-b border-default-200/30 p-8 pb-6",
        body: "p-0",
        footer: "border-t border-default-200/30 p-6 bg-gradient-to-t from-default-50/30 via-transparent to-transparent"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-lg rounded-full" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center border border-primary/20">
                <History size={24} className="text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                Version History
              </h2>
              <p className="text-sm text-default-500 mt-1">View and restore previous versions of this note</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-default-600">
              <Clock size={14} />
              <span>{versions.length} total versions</span>
            </div>
            <div className="flex items-center gap-2 text-default-600">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Auto-saved changes</span>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="overflow-hidden rounded-xl border border-default-200/50">
            <Table
              aria-label="Version history"
              removeWrapper
              classNames={{
                base: "max-h-[500px] overflow-auto",
                th: "bg-gradient-to-b from-default-100 to-default-50/50 text-default-600 text-sm font-semibold h-12 px-6 sticky top-0 z-10 border-b border-default-200/50 backdrop-blur-sm",
                td: "py-4 px-6 border-b border-default-200/30 text-sm group-hover:bg-default-50/30 transition-all duration-200",
                tr: "group hover:bg-default-50/20 transition-colors"
              }}
            >
              <TableHeader>
                <TableColumn className="w-[180px]">DATE & TIME</TableColumn>
                <TableColumn className="w-[150px]">AUTHOR</TableColumn>
                <TableColumn>CONTENT PREVIEW</TableColumn>
                <TableColumn className="w-[120px] text-right">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody emptyContent={
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full" />
                    <History size={64} className="relative text-default-300 opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold text-default-600 mb-2">No version history yet</h3>
                  <p className="text-sm text-default-500 max-w-md">
                    Start editing your note to see version history appear here automatically.
                    Every save creates a new version you can restore.
                  </p>
                </div>
              }>
                {versions.slice().reverse().map((version) => (
                  <TableRow key={version.id} className="group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">
                          {format(new Date(version.createdAt), 'MMM dd, yyyy')}
                        </span>
                        <span className="text-xs text-default-500 font-mono mt-1">
                          {format(new Date(version.createdAt), 'HH:mm:ss')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur opacity-20 rounded-full" />
                          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                            {version.author.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{version.author}</p>
                          <p className="text-xs text-default-500">Editor</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[500px]">
                        <p className="text-default-700 text-sm line-clamp-2">
                          {version.content.replace(/<[^>]*>/g, ' ').trim().substring(0, 150)}
                          {version.content.replace(/<[^>]*>/g, ' ').trim().length > 150 ? '...' : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-default-500 font-mono">
                            {version.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length} words
                          </span>
                          <span className="text-xs text-default-500">•</span>
                          <span className="text-xs text-default-500 font-mono">
                            {version.content.replace(/<[^>]*>/g, ' ').trim().length} chars
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        className="font-medium hover:bg-primary/10 transition-all hover:scale-105 active:scale-95"
                        onPress={() => onRestore(version)}
                        startContent={<RefreshCw size={16} />}
                      >
                        Restore
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-default-500">
              <span className="font-medium">Tip:</span> Restoring a version will create a new version with the restored content
            </div>
            <div className="flex gap-3">
              <Button
                variant="light"
                onPress={onClose}
                className="font-medium h-11 px-6 rounded-xl border border-default-300/50 hover:border-default-400/50"
              >
                Close
              </Button>
              {versions.length > 0 && (
                <Button
                  color="primary"
                  variant="shadow"
                  className="font-semibold h-11 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30"
                  onPress={() => {
                    if (versions.length > 0) {
                      onRestore(versions[versions.length - 1])
                    }
                  }}
                  startContent={<RefreshCw size={16} />}
                >
                  Restore Latest
                </Button>
              )}
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

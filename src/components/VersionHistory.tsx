// src/components/VersionHistory.tsx - ✅ FIXED CELL COUNT ERROR
'use client'

import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell
} from '@heroui/react'
import { History, RefreshCw } from 'lucide-react'
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
        base: "bg-background border border-border shadow-2xl rounded-xl",
        header: "border-b border-border p-6",
        body: "p-0",
        footer: "border-t border-border p-4 bg-muted/50"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <History size={20} className="text-muted-foreground" />
            <h2 className="text-xl font-bold">Version History</h2>
          </div>
          <p className="text-sm text-muted-foreground font-normal">View and restore previous versions of this note.</p>
        </ModalHeader>

        <ModalBody>
          <div className="overflow-x-auto min-h-[300px]">
            <Table
              aria-label="Version history"
              removeWrapper
              classNames={{
                th: "bg-muted/50 text-muted-foreground text-xs font-semibold h-10 first:rounded-l-none last:rounded-r-none",
                td: "py-3 border-b border-border/50 first:rounded-l-none last:rounded-r-none text-sm group-hover:bg-muted/30 transition-colors"
              }}
            >
              <TableHeader>
                <TableColumn>DATE & TIME</TableColumn>
                <TableColumn>AUTHOR</TableColumn>
                <TableColumn>CONTENT PREVIEW</TableColumn>
                <TableColumn className="text-right">ACTION</TableColumn>
              </TableHeader>
              <TableBody>
                {versions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <History size={48} className="opacity-20" />
                        <p className="font-medium">No history available</p>
                        <p className="text-xs">Edits will appear here automatically</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  versions.slice().reverse().map((version) => (
                    <TableRow key={version.id} className="group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {format(new Date(version.createdAt), 'MMM dd, yyyy')}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {format(new Date(version.createdAt), 'h:mm a')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {version.author.charAt(0)}
                          </div>
                          <span className="text-muted-foreground">{version.author}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[400px]">
                        <div className="truncate text-muted-foreground font-mono text-xs">
                          {version.content.replace(/<[^>]*>/g, ' ').trim()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="font-medium text-primary hover:bg-primary/10"
                          onPress={() => onRestore(version)}
                          startContent={<RefreshCw size={14} />}
                        >
                          Restore
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
            className="font-medium"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

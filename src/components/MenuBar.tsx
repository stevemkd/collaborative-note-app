'use client'

import { Button, ButtonGroup, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip } from '@heroui/react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type
} from 'lucide-react'
import { Editor } from '@tiptap/react'

interface MenuBarProps {
  editor: Editor
}

export default function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null

  const headingItems = [
    { level: 1, label: 'Heading 1', icon: <Heading1 size={16} /> },
    { level: 2, label: 'Heading 2', icon: <Heading2 size={16} /> },
    { level: 3, label: 'Heading 3', icon: <Heading3 size={16} /> },
    { level: 0, label: 'Paragraph', icon: <Type size={16} /> }
  ]

  const alignItems = [
    { align: 'left', label: 'Align Left', icon: <AlignLeft size={16} /> },
    { align: 'center', label: 'Align Center', icon: <AlignCenter size={16} /> },
    { align: 'right', label: 'Align Right', icon: <AlignRight size={16} /> },
    { align: 'justify', label: 'Justify', icon: <AlignJustify size={16} /> }
  ]

  return (
    <div className="flex flex-wrap items-center gap-1 justify-center">
      {/* Text Formatting */}
      <ButtonGroup variant="light" size="sm" radius="sm">
        <Tooltip content="Bold (Ctrl+B)">
          <Button
            isIconOnly
            onPress={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? "bg-muted text-primary" : "text-muted-foreground"}
          >
            <Bold size={16} />
          </Button>
        </Tooltip>

        <Tooltip content="Italic (Ctrl+I)">
          <Button
            isIconOnly
            onPress={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? "bg-muted text-primary" : "text-muted-foreground"}
          >
            <Italic size={16} />
          </Button>
        </Tooltip>

        <Tooltip content="Strikethrough (Ctrl+Shift+S)">
          <Button
            isIconOnly
            onPress={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? "bg-muted text-primary" : "text-muted-foreground"}
          >
            <Strikethrough size={16} />
          </Button>
        </Tooltip>

        <Tooltip content="Code (Ctrl+E)">
          <Button
            isIconOnly
            onPress={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? "bg-muted text-primary" : "text-muted-foreground"}
          >
            <Code size={16} />
          </Button>
        </Tooltip>
      </ButtonGroup>

      <div className="w-px h-5 bg-border mx-2" />

      {/* Headings Dropdown */}
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" size="sm" startContent={<Heading1 size={16} />} className="text-muted-foreground">
            Headings
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Heading styles">
          {headingItems.map((item) => (
            <DropdownItem
              key={item.label}
              startContent={item.icon}
              onPress={() => {
                if (item.level === 0) {
                  editor.chain().focus().setParagraph().run()
                } else {
                  editor.chain().focus().toggleHeading({ level: item.level as any }).run()
                }
              }}
              className={editor.isActive('heading', { level: item.level as any }) ? 'bg-muted' : ''}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      <div className="w-px h-5 bg-border mx-2" />

      {/* Lists */}
      <ButtonGroup variant="light" size="sm" radius="sm">
        <Tooltip content="Bullet List">
          <Button
            isIconOnly
            onPress={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? "bg-muted text-primary" : "text-muted-foreground"}
          >
            <List size={16} />
          </Button>
        </Tooltip>

        <Tooltip content="Ordered List">
          <Button
            isIconOnly
            onPress={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? "bg-muted text-primary" : "text-muted-foreground"}
          >
            <ListOrdered size={16} />
          </Button>
        </Tooltip>

        <Tooltip content="Blockquote">
          <Button
            isIconOnly
            onPress={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? "bg-muted text-primary" : "text-muted-foreground"}
          >
            <Quote size={16} />
          </Button>
        </Tooltip>
      </ButtonGroup>

      <div className="w-px h-5 bg-border mx-2" />

      {/* Text Alignment */}
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light" size="sm" startContent={<AlignLeft size={16} />} className="text-muted-foreground">
            Align
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Text alignment">
          {alignItems.map((item) => (
            <DropdownItem
              key={item.align}
              startContent={item.icon}
              onPress={() => editor.chain().focus().setTextAlign(item.align).run()}
              className={editor.isActive({ textAlign: item.align }) ? 'bg-muted' : ''}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}
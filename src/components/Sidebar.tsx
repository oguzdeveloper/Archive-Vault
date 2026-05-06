'use client'

import { useState } from 'react'
import {
  Archive,
  FolderOpen,
  Plus,
  Trash2,
  Globe,
} from 'lucide-react'
import { Folder, Tag } from '@/types'
import { cn } from '@/lib/utils'
import { Locale, t } from '@/lib/i18n'

interface SidebarProps {
  folders: Folder[]
  tags: Tag[]
  selectedFolder: number | null
  selectedTag: number | null
  onSelectFolder: (id: number | null) => void
  onSelectTag: (id: number | null) => void
  onAddFolder: (name: string) => void
  onDeleteFolder: (id: number) => void
  totalBookmarks: number
  locale: Locale
}

export function Sidebar({
  folders,
  tags,
  selectedFolder,
  selectedTag,
  onSelectFolder,
  onSelectTag,
  onAddFolder,
  onDeleteFolder,
  totalBookmarks,
  locale,
}: SidebarProps) {
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim())
      setNewFolderName('')
      setShowNewFolder(false)
    }
  }

  return (
    <aside className="w-64 h-screen border-r border-[var(--border)] flex flex-col bg-[var(--card)] shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <Archive size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base leading-none">ArchiveVault</h1>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {t(locale, 'appDesc')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        {/* All bookmarks */}
        <button
          onClick={() => {
            onSelectFolder(null)
            onSelectTag(null)
          }}
          className={cn(
            'w-full flex items-center gap-2.5 px-5 py-2 text-sm transition-colors',
            !selectedFolder && !selectedTag
              ? 'text-white bg-[var(--primary)]/10 border-r-2 border-[var(--primary)]'
              : 'text-[var(--muted)] hover:text-white hover:bg-white/5'
          )}
        >
          <Globe size={16} />
          <span>{t(locale, 'allArchives')}</span>
          <span className="ml-auto text-xs opacity-60">{totalBookmarks}</span>
        </button>

        {/* Folders */}
        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              {t(locale, 'folders')}
            </span>
            <button
              onClick={() => setShowNewFolder(!showNewFolder)}
              className="text-[var(--muted)] hover:text-white transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {showNewFolder && (
            <div className="mb-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
                placeholder={t(locale, 'folderName')}
                className="w-full px-2.5 py-1.5 text-sm bg-[var(--background)] border border-[var(--border)] rounded-md focus:outline-none focus:border-[var(--primary)] text-white placeholder:text-[var(--muted)]"
                autoFocus
              />
            </div>
          )}
        </div>

        {folders.map((folder) => (
          <div key={folder.id} className="group flex items-center">
            <button
              onClick={() => onSelectFolder(folder.id)}
              className={cn(
                'flex-1 flex items-center gap-2.5 px-5 py-1.5 text-sm transition-colors',
                selectedFolder === folder.id
                  ? 'text-white bg-[var(--primary)]/10 border-r-2 border-[var(--primary)]'
                  : 'text-[var(--muted)] hover:text-white hover:bg-white/5'
              )}
            >
              <FolderOpen size={15} />
              <span className="truncate">{folder.name}</span>
              <span className="ml-auto text-xs opacity-60">
                {folder.bookmark_count || 0}
              </span>
            </button>
            <button
              onClick={() => onDeleteFolder(folder.id)}
              className="opacity-0 group-hover:opacity-100 px-2 text-[var(--muted)] hover:text-[var(--destructive)] transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}

        {/* Tags */}
        <div className="mt-6 px-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            {t(locale, 'tags')}
          </span>
        </div>

        <div className="mt-2 px-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() =>
                onSelectTag(selectedTag === tag.id ? null : tag.id)
              }
              className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all',
                selectedTag === tag.id
                  ? 'ring-1 ring-[var(--primary)] text-white'
                  : 'text-[var(--muted)] hover:text-white'
              )}
              style={{
                backgroundColor:
                  selectedTag === tag.id
                    ? `${tag.color}25`
                    : 'rgba(255,255,255,0.05)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
              <span className="opacity-50">({tag.bookmark_count || 0})</span>
            </button>
          ))}
          {tags.length === 0 && (
            <p className="text-xs text-[var(--muted)] px-2 py-1">
              {t(locale, 'noTags')}
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}

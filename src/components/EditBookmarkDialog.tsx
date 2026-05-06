'use client'

import { useState } from 'react'
import { X, FileText, FolderOpen, Tag, StickyNote } from 'lucide-react'
import { Bookmark, Folder } from '@/types'
import { Locale, t } from '@/lib/i18n'

interface EditBookmarkDialogProps {
  bookmark: Bookmark
  folders: Folder[]
  onSave: (data: {
    title?: string
    notes?: string
    folder_id?: number | null
    tags?: string[]
  }) => void
  onClose: () => void
  locale: Locale
}

export function EditBookmarkDialog({
  bookmark,
  folders,
  onSave,
  onClose,
  locale,
}: EditBookmarkDialogProps) {
  const [title, setTitle] = useState(bookmark.title || '')
  const [notes, setNotes] = useState(bookmark.notes || '')
  const [folderId, setFolderId] = useState<number | null>(bookmark.folder_id)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(
    bookmark.tags?.map((tag) => tag.name) || []
  )

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setTagInput('')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-lg mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-lg">{t(locale, 'edit')}</h2>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] mb-1.5">
              <FileText size={14} />
              {t(locale, 'title')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] text-white"
            />
          </div>

          {/* Folder */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] mb-1.5">
              <FolderOpen size={14} />
              {t(locale, 'folder')}
            </label>
            <select
              value={folderId ?? ''}
              onChange={(e) =>
                setFolderId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] text-white"
            >
              <option value="">{t(locale, 'selectFolder')}</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] mb-1.5">
              <StickyNote size={14} />
              {t(locale, 'notes')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={t(locale, 'notesPlaceholder')}
              className="w-full px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] text-white placeholder:text-[var(--muted)] resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] mb-1.5">
              <Tag size={14} />
              {t(locale, 'tagLabel')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder={t(locale, 'addTagPlaceholder')}
                className="flex-1 px-3 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] text-white placeholder:text-[var(--muted)]"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2.5 bg-[var(--border)] hover:bg-[var(--muted)]/30 rounded-lg text-sm transition-colors"
              >
                {t(locale, 'addTag')}
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tagName) => (
                  <span
                    key={tagName}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--primary)]/15 text-[var(--primary)] rounded-full text-xs"
                  >
                    {tagName}
                    <button
                      onClick={() =>
                        setTags(tags.filter((tag) => tag !== tagName))
                      }
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--muted)] hover:text-white transition-colors"
          >
            {t(locale, 'cancel')}
          </button>
          <button
            onClick={() => onSave({ title, notes, folder_id: folderId, tags })}
            className="px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg text-sm font-medium transition-colors"
          >
            {t(locale, 'save')}
          </button>
        </div>
      </div>
    </div>
  )
}

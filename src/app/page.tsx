'use client'

import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { BookmarkCard } from '@/components/BookmarkCard'
import { AddBookmarkDialog } from '@/components/AddBookmarkDialog'
import { EditBookmarkDialog } from '@/components/EditBookmarkDialog'
import { SearchBar } from '@/components/SearchBar'
import { Bookmark, Tag, Folder } from '@/types'
import { Plus, Archive, Loader2, Globe2 } from 'lucide-react'
import { Locale, t } from '@/lib/i18n'

export default function Home() {
  const [locale, setLocale] = useState<Locale>('tr')
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null)
  const [selectedTag, setSelectedTag] = useState<number | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)

  const fetchBookmarks = useCallback(async () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedFolder) params.set('folder_id', String(selectedFolder))
    if (selectedTag) params.set('tag_id', String(selectedTag))

    const res = await fetch(`/api/bookmarks?${params}`)
    const data = await res.json()
    setBookmarks(data)
    setLoading(false)
  }, [search, selectedFolder, selectedTag])

  const fetchTags = async () => {
    const res = await fetch('/api/tags')
    setTags(await res.json())
  }

  const fetchFolders = async () => {
    const res = await fetch('/api/folders')
    setFolders(await res.json())
  }

  useEffect(() => {
    fetchBookmarks()
    fetchTags()
    fetchFolders()
  }, [fetchBookmarks])

  const handleAddBookmark = async (
    url: string,
    tagNames: string[],
    folderId: number | null
  ) => {
    setShowAddDialog(false)
    setLoading(true)

    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, tags: tagNames, folder_id: folderId }),
    })

    await Promise.all([fetchBookmarks(), fetchTags(), fetchFolders()])
  }

  const handleDeleteBookmark = async (id: number) => {
    await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' })
    await Promise.all([fetchBookmarks(), fetchTags(), fetchFolders()])
  }

  const handleUpdateBookmark = async (
    id: number,
    data: {
      title?: string
      notes?: string
      folder_id?: number | null
      tags?: string[]
    }
  ) => {
    await fetch(`/api/bookmarks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setEditingBookmark(null)
    await Promise.all([fetchBookmarks(), fetchTags(), fetchFolders()])
  }

  const handleAddFolder = async (name: string) => {
    await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    await fetchFolders()
  }

  const handleDeleteFolder = async (id: number) => {
    await fetch(`/api/folders?id=${id}`, { method: 'DELETE' })
    if (selectedFolder === id) setSelectedFolder(null)
    await Promise.all([fetchFolders(), fetchBookmarks()])
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        folders={folders}
        tags={tags}
        selectedFolder={selectedFolder}
        selectedTag={selectedTag}
        onSelectFolder={(id) => {
          setSelectedFolder(id)
          setSelectedTag(null)
        }}
        onSelectTag={(id) => {
          setSelectedTag(id)
          setSelectedFolder(null)
        }}
        onAddFolder={handleAddFolder}
        onDeleteFolder={handleDeleteFolder}
        totalBookmarks={bookmarks.length}
        locale={locale}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)]">
          <SearchBar value={search} onChange={setSearch} locale={locale} />
          <button
            onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}
            className="flex items-center gap-2 px-3 py-2.5 bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--muted)] hover:text-white rounded-lg transition-colors text-sm shrink-0"
            title={locale === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
          >
            <Globe2 size={16} />
            {t(locale, 'language')}
          </button>
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white rounded-lg transition-colors font-medium text-sm shrink-0"
          >
            <Plus size={18} />
            {t(locale, 'add')}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2
                className="animate-spin text-[var(--primary)]"
                size={32}
              />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[var(--muted)]">
              <Archive size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">{t(locale, 'noArchives')}</p>
              <p className="text-sm mt-1">
                {t(locale, 'noArchivesDesc')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {bookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={() => handleDeleteBookmark(bookmark.id)}
                  onEdit={() => setEditingBookmark(bookmark)}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showAddDialog && (
        <AddBookmarkDialog
          folders={folders}
          onAdd={handleAddBookmark}
          onClose={() => setShowAddDialog(false)}
          locale={locale}
        />
      )}

      {editingBookmark && (
        <EditBookmarkDialog
          bookmark={editingBookmark}
          folders={folders}
          onSave={(data) => handleUpdateBookmark(editingBookmark.id, data)}
          onClose={() => setEditingBookmark(null)}
          locale={locale}
        />
      )}
    </div>
  )
}

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'store.json')

export interface StoreData {
  nextBookmarkId: number
  nextTagId: number
  nextFolderId: number
  bookmarks: BookmarkRecord[]
  tags: TagRecord[]
  folders: FolderRecord[]
  bookmarkTags: { bookmark_id: number; tag_id: number }[]
}

export interface BookmarkRecord {
  id: number
  url: string
  title: string
  description: string
  notes: string
  folder_id: number | null
  archived: boolean
  archive_path: string | null
  favicon: string | null
  text_content: string
  created_at: string
  updated_at: string
}

export interface TagRecord {
  id: number
  name: string
  color: string
}

export interface FolderRecord {
  id: number
  name: string
  parent_id: number | null
  created_at: string
}

function defaultStore(): StoreData {
  return {
    nextBookmarkId: 1,
    nextTagId: 1,
    nextFolderId: 1,
    bookmarks: [],
    tags: [],
    folders: [],
    bookmarkTags: [],
  }
}

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function loadStore(): StoreData {
  ensureDir()
  if (!fs.existsSync(DATA_FILE)) {
    const store = defaultStore()
    saveStore(store)
    return store
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8')
  return JSON.parse(raw) as StoreData
}

export function saveStore(store: StoreData): void {
  ensureDir()
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8')
}

// --- Bookmark helpers ---

export function getAllBookmarks(
  search?: string,
  folderId?: number | null,
  tagId?: number | null
) {
  const store = loadStore()
  let results = store.bookmarks

  if (folderId != null) {
    results = results.filter((b) => b.folder_id === folderId)
  }

  if (tagId != null) {
    const bookmarkIds = new Set(
      store.bookmarkTags.filter((bt) => bt.tag_id === tagId).map((bt) => bt.bookmark_id)
    )
    results = results.filter((b) => bookmarkIds.has(b.id))
  }

  if (search) {
    const q = search.toLowerCase()
    results = results.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.text_content.toLowerCase().includes(q) ||
        b.notes.toLowerCase().includes(q)
    )
  }

  // Attach tags
  return results
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((b) => {
      const tagIds = store.bookmarkTags
        .filter((bt) => bt.bookmark_id === b.id)
        .map((bt) => bt.tag_id)
      const tags = store.tags.filter((t) => tagIds.includes(t.id))
      return { ...b, tags }
    })
}

export function getBookmarkById(id: number) {
  const store = loadStore()
  const b = store.bookmarks.find((bk) => bk.id === id)
  if (!b) return null

  const tagIds = store.bookmarkTags
    .filter((bt) => bt.bookmark_id === b.id)
    .map((bt) => bt.tag_id)
  const tags = store.tags.filter((t) => tagIds.includes(t.id))
  return { ...b, tags }
}

export function createBookmark(url: string, folderId: number | null): BookmarkRecord {
  const store = loadStore()
  const now = new Date().toISOString()
  const bookmark: BookmarkRecord = {
    id: store.nextBookmarkId++,
    url,
    title: url,
    description: '',
    notes: '',
    folder_id: folderId,
    archived: false,
    archive_path: null,
    favicon: null,
    text_content: '',
    created_at: now,
    updated_at: now,
  }
  store.bookmarks.push(bookmark)
  saveStore(store)
  return bookmark
}

export function updateBookmark(id: number, data: Partial<BookmarkRecord>) {
  const store = loadStore()
  const idx = store.bookmarks.findIndex((b) => b.id === id)
  if (idx === -1) return null

  store.bookmarks[idx] = {
    ...store.bookmarks[idx],
    ...data,
    updated_at: new Date().toISOString(),
  }
  saveStore(store)
  return store.bookmarks[idx]
}

export function deleteBookmark(id: number) {
  const store = loadStore()
  store.bookmarks = store.bookmarks.filter((b) => b.id !== id)
  store.bookmarkTags = store.bookmarkTags.filter((bt) => bt.bookmark_id !== id)
  saveStore(store)
}

// --- Tag helpers ---

export function getAllTags() {
  const store = loadStore()
  return store.tags.map((t) => {
    const count = store.bookmarkTags.filter((bt) => bt.tag_id === t.id).length
    return { ...t, bookmark_count: count }
  })
}

export function findOrCreateTag(name: string, color?: string): TagRecord {
  const store = loadStore()
  let tag = store.tags.find((t) => t.name === name)
  if (!tag) {
    tag = { id: store.nextTagId++, name, color: color || '#6366f1' }
    store.tags.push(tag)
    saveStore(store)
  }
  return tag
}

export function setBookmarkTags(bookmarkId: number, tagNames: string[]) {
  const store = loadStore()
  store.bookmarkTags = store.bookmarkTags.filter((bt) => bt.bookmark_id !== bookmarkId)

  for (const name of tagNames) {
    const tag = findOrCreateTag(name)
    store.bookmarkTags.push({ bookmark_id: bookmarkId, tag_id: tag.id })
  }
  saveStore(store)
}

// --- Folder helpers ---

export function getAllFolders() {
  const store = loadStore()
  return store.folders
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((f) => {
      const count = store.bookmarks.filter((b) => b.folder_id === f.id).length
      return { ...f, bookmark_count: count }
    })
}

export function createFolder(name: string, parentId?: number | null): FolderRecord {
  const store = loadStore()
  const folder: FolderRecord = {
    id: store.nextFolderId++,
    name,
    parent_id: parentId ?? null,
    created_at: new Date().toISOString(),
  }
  store.folders.push(folder)
  saveStore(store)
  return folder
}

export function deleteFolder(id: number) {
  const store = loadStore()
  store.folders = store.folders.filter((f) => f.id !== id)
  store.bookmarks = store.bookmarks.map((b) =>
    b.folder_id === id ? { ...b, folder_id: null } : b
  )
  saveStore(store)
}

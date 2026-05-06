import { NextRequest, NextResponse } from 'next/server'
import {
  getAllBookmarks,
  createBookmark,
  updateBookmark,
  setBookmarkTags,
  getBookmarkById,
} from '@/lib/db'
import { archiveUrl } from '@/lib/archiver'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || undefined
  const folderId = searchParams.get('folder_id')
    ? Number(searchParams.get('folder_id'))
    : undefined
  const tagId = searchParams.get('tag_id')
    ? Number(searchParams.get('tag_id'))
    : undefined

  const bookmarks = getAllBookmarks(search, folderId, tagId)
  return NextResponse.json(bookmarks)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { url, tags = [], folder_id = null } = body

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  const bookmark = createBookmark(url, folder_id)

  try {
    const archive = await archiveUrl(url, bookmark.id)
    updateBookmark(bookmark.id, {
      title: archive.title,
      description: archive.description,
      text_content: archive.textContent,
      archived: true,
      archive_path: archive.archivePath,
      favicon: archive.favicon,
    })
  } catch (error) {
    console.error('Archive failed:', error)
  }

  if (tags.length > 0) {
    setBookmarkTags(bookmark.id, tags)
  }

  const result = getBookmarkById(bookmark.id)
  return NextResponse.json(result, { status: 201 })
}

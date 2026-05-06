import { NextRequest, NextResponse } from 'next/server'
import {
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
  setBookmarkTags,
} from '@/lib/db'
import { deleteArchive } from '@/lib/archiver'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const bookmark = getBookmarkById(Number(id))

  if (!bookmark) {
    return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 })
  }

  return NextResponse.json(bookmark)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { title, notes, folder_id, tags } = body

  const updates: Record<string, unknown> = {}
  if (title !== undefined) updates.title = title
  if (notes !== undefined) updates.notes = notes
  if (folder_id !== undefined) updates.folder_id = folder_id

  if (Object.keys(updates).length > 0) {
    updateBookmark(Number(id), updates)
  }

  if (tags !== undefined) {
    setBookmarkTags(Number(id), tags)
  }

  const result = getBookmarkById(Number(id))
  return NextResponse.json(result)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const bookmarkId = Number(id)

  deleteArchive(bookmarkId)
  deleteBookmark(bookmarkId)

  return NextResponse.json({ success: true })
}

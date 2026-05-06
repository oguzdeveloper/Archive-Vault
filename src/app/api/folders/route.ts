import { NextRequest, NextResponse } from 'next/server'
import { getAllFolders, createFolder, deleteFolder } from '@/lib/db'

export async function GET() {
  const folders = getAllFolders()
  return NextResponse.json(folders)
}

export async function POST(request: NextRequest) {
  const { name, parent_id } = await request.json()

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const folder = createFolder(name, parent_id)
  return NextResponse.json(folder, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  deleteFolder(Number(id))
  return NextResponse.json({ success: true })
}

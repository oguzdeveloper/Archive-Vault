import { NextRequest, NextResponse } from 'next/server'
import { getArchivePath } from '@/lib/archiver'
import fs from 'fs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const archivePath = getArchivePath(Number(id))

  if (!fs.existsSync(archivePath)) {
    return NextResponse.json({ error: 'Archive not found' }, { status: 404 })
  }

  const html = fs.readFileSync(archivePath, 'utf-8')

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  })
}

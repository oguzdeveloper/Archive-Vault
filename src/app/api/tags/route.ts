import { NextRequest, NextResponse } from 'next/server'
import { getAllTags, findOrCreateTag } from '@/lib/db'

export async function GET() {
  const tags = getAllTags()
  return NextResponse.json(tags)
}

export async function POST(request: NextRequest) {
  const { name, color } = await request.json()

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const tag = findOrCreateTag(name, color)
  return NextResponse.json(tag, { status: 201 })
}

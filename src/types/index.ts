export interface Bookmark {
  id: number
  url: string
  title: string
  description: string | null
  notes: string | null
  folder_id: number | null
  archived: boolean
  archive_path: string | null
  favicon: string | null
  text_content: string | null
  created_at: string
  updated_at: string
  tags?: Tag[]
}

export interface Tag {
  id: number
  name: string
  color: string
  bookmark_count?: number
}

export interface Folder {
  id: number
  name: string
  parent_id: number | null
  created_at: string
  bookmark_count?: number
}

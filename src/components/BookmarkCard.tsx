'use client'

import { Bookmark } from '@/types'
import { ExternalLink, Trash2, Edit3, Archive, FileText } from 'lucide-react'
import { formatDate, getDomain } from '@/lib/utils'
import { Locale, t } from '@/lib/i18n'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: () => void
  onEdit: () => void
  locale: Locale
}

export function BookmarkCard({ bookmark, onDelete, onEdit, locale }: BookmarkCardProps) {
  return (
    <div className="group bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--primary)]/40 transition-all hover:shadow-lg hover:shadow-[var(--primary)]/5">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {bookmark.favicon ? (
            <img
              src={bookmark.favicon}
              alt=""
              className="w-5 h-5 mt-0.5 rounded shrink-0"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="w-5 h-5 mt-0.5 rounded bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
              <FileText size={12} className="text-[var(--primary)]" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-snug text-white truncate">
              {bookmark.title || bookmark.url}
            </h3>
            <p className="text-xs text-[var(--muted)] mt-0.5 truncate">
              {getDomain(bookmark.url)}
            </p>
          </div>
        </div>

        {bookmark.description && (
          <p className="text-xs text-[var(--muted)] mt-2 line-clamp-2">
            {bookmark.description}
          </p>
        )}

        {bookmark.notes && (
          <div className="mt-2 px-2 py-1.5 bg-yellow-500/5 border border-yellow-500/10 rounded text-xs text-yellow-200/70 line-clamp-2">
            {bookmark.notes}
          </div>
        )}

        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {bookmark.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                style={{
                  backgroundColor: `${tag.color}15`,
                  color: tag.color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)] bg-white/[0.02]">
        <span className="text-[10px] text-[var(--muted)]">
          {formatDate(bookmark.created_at)}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {bookmark.archived && (
            <a
              href={`/api/bookmarks/${bookmark.id}/archive`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md hover:bg-[var(--primary)]/20 text-[var(--primary)] transition-colors"
              title={t(locale, 'viewArchive')}
            >
              <Archive size={14} />
            </a>
          )}
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-white/10 text-[var(--muted)] hover:text-white transition-colors"
            title={t(locale, 'openOriginal')}
          >
            <ExternalLink size={14} />
          </a>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md hover:bg-white/10 text-[var(--muted)] hover:text-white transition-colors"
            title={t(locale, 'editBookmark')}
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-md hover:bg-[var(--destructive)]/20 text-[var(--muted)] hover:text-[var(--destructive)] transition-colors"
            title={t(locale, 'deleteBookmark')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

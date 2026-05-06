import * as cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

const ARCHIVES_DIR = path.join(process.cwd(), 'archives')

if (!fs.existsSync(ARCHIVES_DIR)) {
  fs.mkdirSync(ARCHIVES_DIR, { recursive: true })
}

interface ArchiveResult {
  title: string
  description: string
  textContent: string
  archivePath: string
  favicon: string | null
}

export async function archiveUrl(url: string, bookmarkId: number): Promise<ArchiveResult> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  const title =
    $('title').text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    url

  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    ''

  let favicon: string | null = null
  const faviconLink =
    $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    $('link[rel="apple-touch-icon"]').attr('href')

  if (faviconLink) {
    try {
      favicon = new URL(faviconLink, url).href
    } catch {
      favicon = null
    }
  } else {
    try {
      favicon = new URL('/favicon.ico', url).href
    } catch {
      favicon = null
    }
  }

  // Inline CSS stylesheets
  const styleLinks = $('link[rel="stylesheet"]')
  for (let i = 0; i < styleLinks.length; i++) {
    const el = $(styleLinks[i])
    const href = el.attr('href')
    if (href) {
      try {
        const cssUrl = new URL(href, url).href
        const cssResponse = await fetch(cssUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        })
        if (cssResponse.ok) {
          const cssText = await cssResponse.text()
          el.replaceWith(`<style>${cssText}</style>`)
        }
      } catch {
        // Skip failed CSS downloads
      }
    }
  }

  // Inline images as base64
  const images = $('img[src]')
  for (let i = 0; i < images.length; i++) {
    const el = $(images[i])
    const src = el.attr('src')
    if (src && !src.startsWith('data:')) {
      try {
        const imgUrl = new URL(src, url).href
        const imgResponse = await fetch(imgUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
        })
        if (imgResponse.ok) {
          const buffer = await imgResponse.arrayBuffer()
          const contentType = imgResponse.headers.get('content-type') || 'image/png'
          const base64 = Buffer.from(buffer).toString('base64')
          el.attr('src', `data:${contentType};base64,${base64}`)
        }
      } catch {
        // Skip failed image downloads
      }
    }
  }

  // Add base tag for remaining relative URLs
  if (!$('base').length) {
    $('head').prepend(`<base href="${url}">`)
  }

  // Save archived HTML
  const archiveDir = path.join(ARCHIVES_DIR, String(bookmarkId))
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true })
  }

  const archivePath = path.join(archiveDir, 'index.html')
  fs.writeFileSync(archivePath, $.html(), 'utf-8')

  // Extract readable text using Readability
  let textContent = ''
  try {
    const dom = new JSDOM(html, { url })
    const reader = new Readability(dom.window.document)
    const article = reader.parse()
    if (article) {
      textContent = article.textContent.replace(/\s+/g, ' ').trim()
    }
  } catch {
    textContent = $('body').text().replace(/\s+/g, ' ').trim()
  }

  return {
    title,
    description,
    textContent: textContent.substring(0, 50000),
    archivePath: `archives/${bookmarkId}/index.html`,
    favicon,
  }
}

export function getArchivePath(bookmarkId: number): string {
  return path.join(ARCHIVES_DIR, String(bookmarkId), 'index.html')
}

export function deleteArchive(bookmarkId: number): void {
  const archiveDir = path.join(ARCHIVES_DIR, String(bookmarkId))
  if (fs.existsSync(archiveDir)) {
    fs.rmSync(archiveDir, { recursive: true })
  }
}

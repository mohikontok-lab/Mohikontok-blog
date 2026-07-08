"use client"
import React, { useEffect, useState } from 'react'

interface NewsItem {
  title: string
  link: string
}

const Announcements: React.FC = () => {
  const [time, setTime] = useState<string>('')
  const [traffic, setTraffic] = useState<string>('')
  const [headlines, setHeadlines] = useState<NewsItem[]>([])

  // Update time every minute
  useEffect(() => {
    const update = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'America/New_York',
      }
      setTime(now.toLocaleTimeString('en-US', options))
    }
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  // Fetch traffic alerts (NYC DOT RSS). Use CORS proxy if needed.
  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const proxy = 'https://r.jina.ai/http://www.nyc.gov/site/dot/traffic/rss.page?Category=Traffic%20Alerts'
        const res = await fetch(proxy)
        const text = await res.text()
        // simple extract of <title> elements after the first (skip channel title)
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'application/xml')
        const items = Array.from(doc.querySelectorAll('item title')).slice(0, 3)
        const titles = items.map(i => i.textContent?.trim() ?? '').join(' | ')
        setTraffic(titles || 'No traffic alerts')
      } catch (e) {
        console.error('Traffic fetch error', e)
        setTraffic('Traffic data unavailable')
      }
    }
    fetchTraffic()
  }, [])

  // Fetch NYT NYRegion RSS for top 5 headlines
  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const proxy = 'https://r.jina.ai/http://rss.nytimes.com/services/xml/rss/nyt/NYRegion.xml'
        const res = await fetch(proxy)
        const text = await res.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'application/xml')
        const items = Array.from(doc.querySelectorAll('item')).slice(0, 5)
        const news: NewsItem[] = items.map(item => ({
          title: item.querySelector('title')?.textContent?.trim() ?? 'No title',
          link: item.querySelector('link')?.textContent?.trim() ?? '#',
        }))
        setHeadlines(news)
      } catch (e) {
        console.error('Headlines fetch error', e)
        setHeadlines([])
      }
    }
    fetchHeadlines()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: 'var(--color-white)' }}>
      <div><strong>Current Time (NY):</strong> {time}</div>
      <div><strong>Traffic Alerts:</strong> {traffic}</div>
      <div><strong>NYT Top 5:</strong></div>
      <ul style={{ margin: 0, paddingLeft: '16px' }}>
        {headlines.map((item, idx) => (
          <li key={idx} style={{ marginBottom: '2px' }}>
            <a href={item.link} target="_blank" rel="noreferrer" style={{ color: 'var(--color-orange)' }}>{item.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Announcements

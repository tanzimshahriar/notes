import { useEffect, useMemo, useState } from 'react'

type Note = { id: string; folder: string; body: string; pinned: boolean; updated: number }

const uid = () => Math.random().toString(36).slice(2, 10)
const load = <T,>(k: string, d: T): T => {
  try { return JSON.parse(localStorage.getItem(k) ?? '') ?? d } catch { return d }
}
const usePersist = <T,>(k: string, d: T) => {
  const [v, setV] = useState<T>(() => load(k, d))
  useEffect(() => localStorage.setItem(k, JSON.stringify(v)), [k, v])
  return [v, setV] as const
}
const titleOf = (n: Note) => n.body.trim().split('\n')[0] || 'New Note'
const previewOf = (n: Note) => n.body.trim().split('\n').slice(1).join(' ').trim() || 'No additional text'
const fmt = (t: number) => {
  const d = new Date(t)
  return d.toDateString() === new Date().toDateString()
    ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : d.toLocaleDateString()
}

const ALL = 'All Notes'

export default function App() {
  const [notes, setNotes] = usePersist<Note[]>('notes', [])
  const [folders, setFolders] = usePersist<string[]>('folders', ['Notes'])
  const [theme, setTheme] = usePersist<'light' | 'dark'>('theme',
    matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  const [folder, setFolder] = useState(ALL)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [view, setView] = useState<'folders' | 'list' | 'editor'>('list')

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  const visible = useMemo(() => notes
    .filter(n => folder === ALL || n.folder === folder)
    .filter(n => n.body.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updated - a.updated), [notes, folder, q])

  const active = notes.find(n => n.id === activeId)
  const update = (id: string, patch: Partial<Note>) =>
    setNotes(ns => ns.map(n => n.id === id ? { ...n, ...patch, updated: patch.pinned === undefined ? Date.now() : n.updated } : n))

  const addNote = () => {
    const n: Note = { id: uid(), folder: folder === ALL ? folders[0] ?? 'Notes' : folder, body: '', pinned: false, updated: Date.now() }
    setNotes(ns => [n, ...ns]); setActiveId(n.id); setView('editor')
  }
  const delNote = (id: string) => {
    if (!confirm('Delete this note?')) return
    setNotes(ns => ns.filter(n => n.id !== id)); setActiveId(null); setView('list')
  }
  const addFolder = () => {
    const name = prompt('Folder name')?.trim()
    if (name && !folders.includes(name) && name !== ALL) { setFolders([...folders, name]); setFolder(name) }
  }
  const delFolder = (f: string) => {
    if (!confirm(`Delete "${f}" and its notes?`)) return
    setFolders(folders.filter(x => x !== f)); setNotes(ns => ns.filter(n => n.folder !== f)); setFolder(ALL)
  }
  const exportAll = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ notes, folders }, null, 2)], { type: 'application/json' }))
    a.download = 'notes-backup.json'; a.click()
  }

  const count = (f: string) => f === ALL ? notes.length : notes.filter(n => n.folder === f).length

  return (
    <div className={`app view-${view}`}>
      <aside className="folders">
        <h2>Folders</h2>
        {[ALL, ...folders].map(f => (
          <div key={f} className={`folder ${f === folder ? 'sel' : ''}`}
            onClick={() => { setFolder(f); setView('list') }}>
            <span>📁 {f}</span>
            <span className="muted">{count(f)}</span>
            {f !== ALL && <button className="x" onClick={e => { e.stopPropagation(); delFolder(f) }}>×</button>}
          </div>
        ))}
        <div className="foot">
          <button onClick={addFolder}>＋ New Folder</button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☀️' : '🌙'}</button>
          <button onClick={exportAll} title="Export backup">⤓</button>
        </div>
      </aside>

      <section className="list">
        <header>
          <button className="back" onClick={() => setView('folders')}>‹ Folders</button>
          <h1>{folder}</h1>
          <button className="icon" onClick={addNote} title="New note">✎</button>
        </header>
        <input className="search" placeholder="Search" value={q} onChange={e => setQ(e.target.value)} />
        <div className="items">
          {visible.length === 0 && <p className="empty">No notes</p>}
          {visible.map(n => (
            <div key={n.id} className={`item ${n.id === activeId ? 'sel' : ''}`}
              onClick={() => { setActiveId(n.id); setView('editor') }}>
              <strong>{n.pinned && '📌 '}{titleOf(n)}</strong>
              <div className="muted"><span>{fmt(n.updated)}</span> {previewOf(n)}</div>
            </div>
          ))}
        </div>
      </section>

      <main className="editor">
        {active ? <>
          <header>
            <button className="back" onClick={() => setView('list')}>‹ {folder}</button>
            <span className="muted">{new Date(active.updated).toLocaleString()}</span>
            <div>
              <select value={active.folder} onChange={e => update(active.id, { folder: e.target.value })}>
                {folders.map(f => <option key={f}>{f}</option>)}
              </select>
              <button className="icon" onClick={() => update(active.id, { pinned: !active.pinned })}
                title="Pin">{active.pinned ? '📌' : '📍'}</button>
              <button className="icon" onClick={() => delNote(active.id)} title="Delete">🗑</button>
            </div>
          </header>
          <textarea autoFocus value={active.body} placeholder="Start typing…"
            onChange={e => update(active.id, { body: e.target.value })} />
          <footer className="muted">{active.body.trim().split(/\s+/).filter(Boolean).length} words</footer>
        </> : <p className="empty">Select or create a note</p>}
      </main>
    </div>
  )
}

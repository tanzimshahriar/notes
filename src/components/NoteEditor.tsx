'use client'
import { Note as NoteType } from "@/types/Note"

const NoteEditor = ({ note, setTitle, setDescription }: {
    note: NoteType
    setTitle: (title: string) => void
    setDescription: (description: string) => void
}) => {
    return <div className="flex-1 md:col-span-3 flex flex-col">
        <input placeholder="Add title here..." className="text text-xl p-4 w-full outline-none" value={note.title || ''} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Add your notes here..." className="p-4 w-full flex-1 outline-none" value={note.description} onChange={(e) => setDescription(e.target.value)}></textarea>
    </div>
}

export default NoteEditor

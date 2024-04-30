'use client'
import { Note as NoteType } from "@/types/Note"

const NoteList = ({ lists, selectedNote, setSelectedNote }: {
    lists: NoteType[]
    selectedNote: number
    setSelectedNote: (index: number) => void
}) => {
    return (
        <div className="text-xs space-y-4 p-4">
            {lists.map((note, i) => (
                <button key={i} onClick={() => setSelectedNote(i)} className={`flex duration-300 overflow-hidden rounded-lg w-full flex-col text-left py-2 px-4 space-y-1${selectedNote === i ? ' bg-orange-200' : ' hover:bg-gray-100'}`}>
                    <div className="text-sm font-bold">{note.title || 'New note'}</div>
                    <div className="text-gray-500">{note.date}</div>
                    <div className="text-gray-500 line-clamp-1">{note.description || ''}</div>
                </button>
            ))}

        </div>
    )
}

export default NoteList

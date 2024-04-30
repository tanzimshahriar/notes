'use client'
import { Note as NoteType } from "@/types/Note"

const NoteList = ({ lists, selectedNote, setSelectedNote, isExpanded }: {
    lists: NoteType[]
    selectedNote: number
    setSelectedNote: (index: number) => void
    isExpanded: boolean
}) => {
    return (
        <div className="text-xs space-y-2 md:space-y-4 p-4">
            {lists.map((note, i) => (
                <button key={i} onClick={() => setSelectedNote(i)} className={`flex duration-300 overflow-hidden rounded-lg w-full flex-col text-left py-2 px-4 space-y-1${selectedNote === i ? ' bg-orange-200' : ' hover:bg-gray-100'}`}>
                    <div className="hidden md:block text-sm font-bold">{note.title || 'New note'}</div>
                    <div className="hidden md:block text-gray-500">{note.date}</div>
                    <div className="hidden md:block text-gray-500">{note.description.substring(0, 30) + (note.description.length > 30 ? '...' : '')}</div>
                    <div className="md:hidden font-bold">{isExpanded ? note.title || 'New note' : note.title.charAt(0) || 'N'}</div>
                    {isExpanded && <div className="md:hidden text-gray-500 text-[9px]">{note.date}</div>}
                </button>
            ))}

        </div>
    )
}

export default NoteList

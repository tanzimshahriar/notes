'use client'

import { useEffect, useState } from "react"
import NoteEditor from "./NoteEditor"
import NoteList from "./NoteList"
import Image from "next/image"
import { Note } from "@/types/Note"

const generateNewNote = () => {
    const date = new Date()
    return { title: '',
        date: date.toDateString() + ', ' + date.toLocaleTimeString([], { hour12: true, timeStyle: 'short' }),
        description: ''
    }
}

const NotesContent = () => {
    const [lists, setLists] = useState<Array<Note>>(typeof window !== "undefined" ? JSON.parse(localStorage.getItem('lists') || JSON.stringify([generateNewNote()])) : null || [generateNewNote()])
    const [selectedNote, setSelectedNote] = useState(0)

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem('lists', JSON.stringify(lists))
        }
    }, [lists])

    const createNewNote = () => {
        const note = generateNewNote()
        setLists([note, ...lists])
        setSelectedNote(0)
    }

    const deleteNote = () => {
        if (lists.length === 1) {
            const date = new Date()
            setLists([{
                title: '',
                date: date.toDateString() + ', ' + date.toLocaleTimeString([], { hour12: true, timeStyle: 'short' }),
                description: ''
            }])
        } else {
            setLists(lists.filter((note, i) => selectedNote !== i))
        }
    }

    return (
        <>
            <nav className="h-full border-r">
                <div className="px-8 py-4 flex items-center text-gray-500 font-bold">Notes</div>
                <NoteList lists={lists} selectedNote={selectedNote} setSelectedNote={setSelectedNote} />
            </nav>
            <div className="h-full md:col-span-3 flex flex-col">
                <div className="flex items-center p-3 md:col-span-3 justify-between">
                    <div className="flex gap-1">
                        <button onClick={createNewNote} className="hover:bg-gray-100 duration-300 p-2 rounded-lg">
                            <Image src="edit.svg" alt="create" width={20} height={20} />
                        </button>
                        <button onClick={deleteNote} className="flex items-center hover:bg-gray-100 duration-300 p-2 rounded-lg">
                            <Image src="trash.svg" alt="delete" width={20} height={20} />
                        </button>
                    </div>
                </div>
                <NoteEditor note={lists[selectedNote] || null} setTitle={(title: string) => setLists(lists.map((note, i) => {
                    if (selectedNote === i) note.title = title
                    return note
                }))} setDescription={(description: string) => setLists(lists.map((note, i) => {
                    if (selectedNote === i) note.description = description
                    return note
                }))} />
            </div>

        </>
    )
}

export default NotesContent
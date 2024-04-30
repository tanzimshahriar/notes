'use client'

import { useEffect, useState } from "react"
import NoteEditor from "./NoteEditor"
import NoteList from "./NoteList"
import Image from "next/image"
import { Note } from "@/types/Note"

const generateNewNote = () => {
    const date = new Date()
    return {
        title: '',
        date: date.toDateString() + ', ' + date.toLocaleTimeString([], { hour12: true, timeStyle: 'short' }),
        description: ''
    }
}

const NotesContent = () => {
    const [lists, setLists] = useState<Array<Note>>(typeof window !== "undefined" ? JSON.parse(localStorage.getItem('lists') || JSON.stringify([generateNewNote()])) : null || [generateNewNote()])
    const [selectedNote, setSelectedNote] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false)

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
            <nav className={`h-full border-r md:w-64 xl:w-72 bg-gray-50 md:bg-white overflow-scroll ${isExpanded ? 'w-48' : 'w-18'}`}>
                <div className="flex p-4 md:px-6 gap-3 absolute">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="md:hidden p-2 bg-gray-200 rounded-full">
                        <Image src="menu.svg" alt="menu" width={20} height={20} />
                    </button>
                    <div className="hidden md:flex items-center text-gray-500 font-bold">Notes</div>
                </div>
                <div className="h-12"></div>
                <NoteList isExpanded={isExpanded} lists={lists} selectedNote={selectedNote} setSelectedNote={setSelectedNote} />
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
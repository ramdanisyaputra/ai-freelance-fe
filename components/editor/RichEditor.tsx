import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import { useEffect, useCallback, useRef } from 'react'
import axios from '@/lib/axios'

interface RichEditorProps {
    content: string
    onChange?: (html: string) => void
    editable?: boolean
    placeholder?: string
    className?: string
}

export default function RichEditor({
    content,
    onChange,
    editable = true,
    placeholder = 'Start writing...',
    className = ''
}: RichEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4]
                }
            }),
            Placeholder.configure({
                placeholder
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-4'
                }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-800'
                }
            }),
            Underline,
            TextStyle,
            Color,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML())
            }
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-gray-900 prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3 prose-p:text-gray-700 prose-p:my-3 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ul:my-3 prose-ol:text-gray-700 prose-ol:my-3 prose-li:my-1 prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6 prose-img:rounded-lg prose-img:border prose-img:border-gray-200 prose-hr:my-4 prose-hr:border-gray-200'
            }
        }
    })

    // Update editable state when prop changes
    useEffect(() => {
        if (editor) {
            editor.setEditable(editable)
        }
    }, [editor, editable])

    // Sync content when it changes externally
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    // Image upload handler
    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor) return

        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await axios.post('/api/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            const url = response.data.data?.url
            if (url) {
                editor.chain().focus().setImage({ src: url }).run()
            } else {
                alert('Failed to upload image')
            }
        } catch (error) {
            console.error('Image upload error:', error)
            alert('Error uploading image')
        }
    }, [editor])

    const addImage = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleImageUpload(file)
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }, [handleImageUpload])

    if (!editor) {
        return null
    }

    return (
        <div className={`border border-gray-200 rounded-xl overflow-hidden ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
            />

            {editable && (
                <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 flex flex-wrap gap-1 items-center sticky top-0 z-10 backdrop-blur-sm bg-gray-50/95">

                    {/* History */}
                    <div className="flex gap-0.5 mr-2 pr-2 border-r border-gray-300">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-40"
                            title="Undo"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-40"
                            title="Redo"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7" /></svg>
                        </button>
                    </div>

                    {/* Basic Formatting */}
                    <div className="flex gap-0.5 mr-2 pr-2 border-r border-gray-300">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
                            title="Bold"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /></svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
                            title="Italic"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
                            title="Underline"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" /><line x1="4" y1="21" x2="20" y2="21" /></svg>
                        </button>
                        <div className="relative flex items-center justify-center p-1.5 w-8 h-8 rounded hover:bg-gray-200 cursor-pointer overflow-hidden">
                            <input
                                type="color"
                                onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
                                value={editor.getAttributes('textStyle').color || '#000000'}
                                className="absolute opacity-0 w-full h-full cursor-pointer"
                                title="Text Color"
                            />
                            <span
                                className="w-4 h-4 rounded-full border border-gray-300 shadow-sm pointer-events-none"
                                style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
                            />
                        </div>
                    </div>

                    {/* Hierarchy */}
                    <div className="flex gap-0.5 mr-2 pr-2 border-r border-gray-300">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`px-2 py-1 text-xs font-bold rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
                            title="Heading 2"
                        >
                            H2
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={`px-2 py-1 text-xs font-bold rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
                            title="Heading 3"
                        >
                            H3
                        </button>
                    </div>

                    {/* Alignment */}
                    <div className="flex gap-0.5 mr-2 pr-2 border-r border-gray-300">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
                            title="Align Left"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="17" y1="18" x2="3" y2="18" /></svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
                            title="Align Center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6" /><line x1="17" y1="10" x2="7" y2="10" /><line x1="19" y1="14" x2="5" y2="14" /><line x1="17" y1="18" x2="7" y2="18" /></svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
                            title="Align Right"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="7" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="7" y2="18" /></svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                            className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : ''}`}
                            title="Justify"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10" /><line x1="21" y1="6" x2="3" y2="6" /><line x1="21" y1="14" x2="3" y2="14" /><line x1="21" y1="18" x2="3" y2="18" /></svg>
                        </button>
                    </div>

                    {/* Lists & Quotes */}
                    <div className="flex gap-0.5 mr-2 pr-2 border-r border-gray-300">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
                            title="Bullet List"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
                            title="Numbered List"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /></svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            className={`p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
                            title="Quote"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /></svg>
                        </button>
                    </div>

                    {/* Extras */}
                    <div className="flex gap-0.5">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700"
                            title="Horizontal Line"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </button>
                        <button
                            type="button"
                            onClick={addImage}
                            className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-700"
                            title="Upload Image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        </button>
                    </div>
                </div>
            )}
            <EditorContent editor={editor} className="bg-white" />
        </div>
    )
}

'use client'

import React, { useCallback, useMemo } from 'react'
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Color from '@tiptap/extension-color'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Youtube from '@tiptap/extension-youtube'
import Underline from '@tiptap/extension-underline'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Editor } from '@tiptap/react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Heading3,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Underline as UnderlineIcon,
    Highlighter,
    Link as LinkIcon,
    Link2Off,
    Superscript as SuperscriptIcon,
    Subscript as SubscriptIcon,
    Type,
    Image as ImageIcon,
    Table as TableIcon,
    Youtube as YoutubeIcon,
    Code,
    CheckSquare,
    Palette,
    FileCode,
    Settings2,
} from "lucide-react"

interface EditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    error?: boolean
    readOnly?: boolean
    maxLength?: number
    onImageUpload?: (file: File) => Promise<string>
    className?: string
}

const FONT_FAMILIES = [
    { name: 'Default', value: 'Inter' },
    { name: 'Serif', value: 'Georgia' },
    { name: 'Monospace', value: 'JetBrains Mono' },
    { name: 'Comic Sans', value: 'Comic Sans MS' },
    { name: 'Times New Roman', value: 'Times New Roman' },
    { name: 'Arial', value: 'Arial' },
]

const TEXT_COLORS = [
    { name: 'Default', value: 'inherit' },
    { name: 'Primary', value: 'rgb(var(--primary))' },
    { name: 'Secondary', value: 'rgb(var(--secondary))' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
]

const HIGHLIGHT_COLORS = [
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Lime', value: '#d9f99d' },
    { name: 'Pink', value: '#fbcfe8' },
    { name: 'Blue', value: '#bae6fd' },
]

const lowlight = createLowlight(common)

const RichTextEditor = ({
    value,
    onChange,
    placeholder = 'Write something...',
    error = false,
    readOnly = false,
    maxLength,
    onImageUpload,
    className,
}: EditorProps) => {
    const editorConfig = useMemo(() => ({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 hover:text-primary/80',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            FontFamily,
            Color,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full',
                },
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Youtube.configure({
                width: 640,
                height: 480,
            }),
            Underline,
            Superscript,
            Subscript,
            Placeholder.configure({
                placeholder,
            }),
            ...(maxLength ? [CharacterCount.configure({ limit: maxLength })] : []),
        ],
        content: value,
        editable: !readOnly,
        onUpdate: ({ editor }: { editor: Editor }) => {
            const timeoutId = setTimeout(() => {
                onChange(editor.getHTML())
            }, 100)
            return () => clearTimeout(timeoutId)
        },
        editorProps: {
            attributes: {
                class: cn(
                    "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    "prose prose-sm max-w-full focus:outline-none dark:prose-invert",
                    "prose-headings:font-bold prose-headings:tracking-tight",
                    "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base",
                    "prose-p:leading-7",
                    "prose-pre:rounded-lg prose-pre:border",
                    "prose-code:rounded-md prose-code:border prose-code:bg-muted prose-code:px-1 prose-code:py-0.5",
                    "prose-img:rounded-lg",
                    error && "border-destructive focus-visible:ring-destructive",
                    className
                ),
            },
        },
    }), [value, readOnly, onChange, maxLength, placeholder, error, className])

    const editor = useEditor(editorConfig)

    const memoizedAddImage = useCallback(async () => {
        if (!editor || !onImageUpload) return

        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async () => {
            const file = input.files?.[0]
            if (file) {
                try {
                    const url = await onImageUpload(file)
                    editor.chain().focus().setImage({ src: url }).run()
                } catch (error) {
                    console.error('Error uploading image:', error)
                }
            }
        }
        input.click()
    }, [editor, onImageUpload])

    const memoizedAddYoutubeVideo = useCallback(() => {
        if (!editor) return

        const url = window.prompt('Enter YouTube URL')
        if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run()
        }
    }, [editor])

    const memoizedAddLink = useCallback(() => {
        if (!editor) return

        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const memoizedAddTable = useCallback(() => {
        if (!editor) return

        editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
    }, [editor])

    const HeadingSelect = useMemo(() => {
        return () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                        <Type className="h-4 w-4" />
                        <span>Heading</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Heading Level</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                        value={
                            editor?.isActive('heading', { level: 1 })
                                ? 'h1'
                                : editor?.isActive('heading', { level: 2 })
                                    ? 'h2'
                                    : editor?.isActive('heading', { level: 3 })
                                        ? 'h3'
                                        : 'p'
                        }
                    >
                        <DropdownMenuRadioItem
                            value="p"
                            onClick={() => editor?.chain().focus().setParagraph().run()}
                        >
                            Paragraph
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                            value="h1"
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                        >
                            Heading 1
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                            value="h2"
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                        >
                            Heading 2
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                            value="h3"
                            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                        >
                            Heading 3
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }, [editor])

    const ColorSelect = useMemo(() => {
        return () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <Palette className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Text Color</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {TEXT_COLORS.map((color) => (
                        <DropdownMenuItem
                            key={color.value}
                            onClick={() => editor?.chain().focus().setColor(color.value).run()}
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-4 w-4 rounded-full border"
                                    style={{ backgroundColor: color.value }}
                                />
                                <span>{color.name}</span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Highlight Color</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {HIGHLIGHT_COLORS.map((color) => (
                        <DropdownMenuItem
                            key={color.value}
                            onClick={() =>
                                editor?.chain().focus().toggleHighlight({ color: color.value }).run()
                            }
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-4 w-4 rounded-full border"
                                    style={{ backgroundColor: color.value }}
                                />
                                <span>{color.name}</span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }, [editor])

    const renderToolbar = useMemo(() => {
        return () => (
            <div className="flex flex-wrap gap-1 p-1 border rounded-md bg-muted/50">
                <div className="flex flex-wrap items-center gap-1 mr-2">
                    <HeadingSelect />
                    <ColorSelect />
                </div>

                <Separator orientation="vertical" className="mx-1 h-8" />

                <div className="flex flex-wrap items-center gap-1">
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('bold')}
                        onPressedChange={() => editor?.chain().focus().toggleBold().run()}
                    >
                        <Bold className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('italic')}
                        onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
                    >
                        <Italic className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('underline')}
                        onPressedChange={() => editor?.chain().focus().toggleUnderline().run()}
                    >
                        <UnderlineIcon className="h-4 w-4" />
                    </Toggle>
                </div>

                <Separator orientation="vertical" className="mx-1 h-8" />

                <div className="flex flex-wrap items-center gap-1">
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('bulletList')}
                        onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
                    >
                        <List className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('orderedList')}
                        onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('taskList')}
                        onPressedChange={() => editor?.chain().focus().toggleTaskList().run()}
                    >
                        <CheckSquare className="h-4 w-4" />
                    </Toggle>
                </div>

                <Separator orientation="vertical" className="mx-1 h-8" />

                <div className="flex flex-wrap items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={memoizedAddImage}>
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={memoizedAddTable}>
                        <TableIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={memoizedAddYoutubeVideo}>
                        <YoutubeIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
                        <FileCode className="h-4 w-4" />
                    </Button>
                </div>

                <Separator orientation="vertical" className="mx-1 h-8" />

                <div className="flex flex-wrap items-center gap-1">
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive({ textAlign: 'left' })}
                        onPressedChange={() => editor?.chain().focus().setTextAlign('left').run()}
                    >
                        <AlignLeft className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive({ textAlign: 'center' })}
                        onPressedChange={() => editor?.chain().focus().setTextAlign('center').run()}
                    >
                        <AlignCenter className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive({ textAlign: 'right' })}
                        onPressedChange={() => editor?.chain().focus().setTextAlign('right').run()}
                    >
                        <AlignRight className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive({ textAlign: 'justify' })}
                        onPressedChange={() => editor?.chain().focus().setTextAlign('justify').run()}
                    >
                        <AlignJustify className="h-4 w-4" />
                    </Toggle>
                </div>

                <Separator orientation="vertical" className="mx-1 h-8" />

                <div className="flex flex-wrap items-center gap-1">
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('superscript')}
                        onPressedChange={() => editor?.chain().focus().toggleSuperscript().run()}
                    >
                        <SuperscriptIcon className="h-4 w-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        pressed={editor?.isActive('subscript')}
                        onPressedChange={() => editor?.chain().focus().toggleSubscript().run()}
                    >
                        <SubscriptIcon className="h-4 w-4" />
                    </Toggle>
                </div>

                <Separator orientation="vertical" className="mx-1 h-8" />

                <div className="flex flex-wrap items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={memoizedAddLink}
                        className={cn(editor?.isActive('link') && 'bg-muted')}
                    >
                        <LinkIcon className="h-4 w-4" />
                    </Button>
                    {editor?.isActive('link') && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().unsetLink().run()}
                        >
                            <Link2Off className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor?.chain().focus().undo().run()}
                        disabled={!editor?.can().undo()}
                    >
                        <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor?.chain().focus().redo().run()}
                        disabled={!editor?.can().redo()}
                    >
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }, [editor, memoizedAddImage, memoizedAddYoutubeVideo, memoizedAddLink, memoizedAddTable])

    const FloatingMenuContent = () => {
        if (!editor) return null

        return (
            <div className="flex items-center gap-1 p-1 border rounded-lg bg-background shadow-md">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleTaskList().run()}
                >
                    <CheckSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={memoizedAddImage}>
                    <ImageIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={memoizedAddTable}>
                    <TableIcon className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <Code className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    const TableButtons = () => {
        if (!editor?.isActive('table')) return null

        return (
            <div className="fixed bottom-4 right-4 flex items-center gap-2 p-2 border rounded-lg bg-background shadow-md">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().addColumnBefore().run()}
                >
                    Add Column Before
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().addColumnAfter().run()}
                >
                    Add Column After
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().addRowBefore().run()}
                >
                    Add Row Before
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                >
                    Add Row After
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                >
                    Delete Column
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().deleteRow().run()}
                >
                    Delete Row
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().deleteTable().run()}
                >
                    Delete Table
                </Button>
            </div>
        )
    }

    if (!editor) {
        return null
    }

    return (
        <div className="relative space-y-2">
            {!readOnly && renderToolbar()}

            {editor && !readOnly && (
                <>
                    <BubbleMenu
                        editor={editor}
                        tippyOptions={{ 
                            duration: 100,
                            placement: 'top',
                            popperOptions: {
                                modifiers: [
                                    {
                                        name: 'flip',
                                        options: {
                                            fallbackPlacements: ['bottom'],
                                        },
                                    },
                                ],
                            },
                        }}
                        className="flex overflow-hidden rounded-md border bg-background shadow-md"
                    >
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('bold')}
                            onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        >
                            <Bold className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('italic')}
                            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        >
                            <Italic className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive('strike')}
                            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                        >
                            <UnderlineIcon className="h-4 w-4" />
                        </Toggle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={memoizedAddLink}
                            className={cn(editor.isActive('link') && 'bg-muted')}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                        <ColorSelect />
                    </BubbleMenu>

                    <FloatingMenu
                        editor={editor}
                        tippyOptions={{ 
                            duration: 100,
                            placement: 'top',
                            popperOptions: {
                                modifiers: [
                                    {
                                        name: 'flip',
                                        options: {
                                            fallbackPlacements: ['bottom'],
                                        },
                                    },
                                ],
                            },
                        }}
                        className="flex overflow-hidden rounded-md border bg-background shadow-md"
                    >
                        <FloatingMenuContent />
                    </FloatingMenu>
                </>
            )}

            <div className="relative">
                <EditorContent editor={editor} />
                <TableButtons />

                {maxLength && (
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {editor.storage.characterCount.characters()}/{maxLength} characters
                    </div>
                )}
            </div>
        </div>
    )
}

export default React.memo(RichTextEditor)
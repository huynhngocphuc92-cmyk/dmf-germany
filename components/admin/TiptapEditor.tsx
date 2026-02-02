"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  RemoveFormatting,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useCallback } from "react";

// ============================================
// TYPES
// ============================================

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

// ============================================
// TOOLBAR BUTTON
// ============================================

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
  return (
    <Toggle
      size="sm"
      pressed={isActive}
      onPressedChange={onClick}
      disabled={disabled}
      className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
      title={title}
    >
      {children}
    </Toggle>
  );
}

// ============================================
// MENU BAR
// ============================================

interface MenuBarProps {
  editor: Editor | null;
}

function MenuBar({ editor }: MenuBarProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const setLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();

    setLinkUrl("");
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor || !imageUrl) return;

    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl("");
  }, [editor, imageUrl]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-lg">
      {/* Undo/Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-4 h-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="Code"
      >
        <Code className="w-4 h-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Numbered List"
      >
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Quote"
      >
        <Quote className="w-4 h-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Horizontal Rule */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus className="w-4 h-4" />
      </ToolbarButton>

      {/* Clear Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        title="Clear Formatting"
      >
        <RemoveFormatting className="w-4 h-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Link */}
      <Popover>
        <PopoverTrigger asChild>
          <Toggle
            size="sm"
            pressed={editor.isActive("link")}
            className="h-8 w-8 p-0 data-[state=on]:bg-slate-200"
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-3">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={setLink}>
                {linkUrl ? "Set Link" : "Remove Link"}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Image */}
      <Popover>
        <PopoverTrigger asChild>
          <Toggle size="sm" className="h-8 w-8 p-0" title="Add Image">
            <ImageIcon className="w-4 h-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-3">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button size="sm" onClick={addImage} disabled={!imageUrl}>
              Insert Image
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ============================================
// MAIN EDITOR COMPONENT
// ============================================

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Viết nội dung...",
}: TiptapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-slate-400 before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

// ============================================
// EDITOR STYLES (add to global CSS)
// ============================================

/*
Add these styles to your globals.css:

.ProseMirror {
  min-height: 400px;
}

.ProseMirror h1 {
  @apply text-3xl font-bold mt-6 mb-4;
}

.ProseMirror h2 {
  @apply text-2xl font-bold mt-5 mb-3;
}

.ProseMirror h3 {
  @apply text-xl font-semibold mt-4 mb-2;
}

.ProseMirror p {
  @apply my-3;
}

.ProseMirror ul {
  @apply list-disc pl-6 my-3;
}

.ProseMirror ol {
  @apply list-decimal pl-6 my-3;
}

.ProseMirror blockquote {
  @apply border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4;
}

.ProseMirror code {
  @apply bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono;
}

.ProseMirror pre {
  @apply bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto my-4;
}

.ProseMirror hr {
  @apply border-slate-200 my-6;
}

.ProseMirror img {
  @apply max-w-full h-auto rounded-lg my-4;
}
*/

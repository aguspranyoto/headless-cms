'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useCallback, useState } from 'react';
import { MediaManager } from './MediaManager';

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichEditor({ content, onChange }: RichEditorProps) {
  const [mediaOpen, setMediaOpen] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit, Image.configure({ inline: false })],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
    setMediaOpen(true);
  }, [editor]);

  if (!editor) return null;

  const getButtonClass = (isActive: boolean) => 
    `px-2 py-1 rounded text-sm transition-colors ${isActive ? 'bg-secondary text-secondary-foreground' : 'text-foreground hover:bg-secondary/50'}`;

  return (
    <>
      <MediaManager
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(url) => {
          editor.chain().focus().setImage({ src: url }).run();
          setMediaOpen(false);
        }}
      />
      <div className="border border-input rounded-lg overflow-hidden bg-background">
        <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-muted/50 border-b border-input">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={getButtonClass(editor.isActive('bold'))}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={getButtonClass(editor.isActive('italic'))}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={getButtonClass(editor.isActive('heading', { level: 2 }))}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={getButtonClass(editor.isActive('heading', { level: 3 }))}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={getButtonClass(editor.isActive('bulletList'))}
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={getButtonClass(editor.isActive('orderedList'))}
          >
            1. List
          </button>
          <button
            type="button"
            onClick={addImage}
            className={getButtonClass(false)}
          >
            🖼 Image
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className={`${getButtonClass(false)} ml-auto`}
          >
            ↩
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className={getButtonClass(false)}
          >
            ↪
          </button>
        </div>
        <EditorContent
          editor={editor}
          className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none"
        />
      </div>
    </>
  );
}

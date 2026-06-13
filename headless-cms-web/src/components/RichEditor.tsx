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
      <div className="border rounded-lg overflow-hidden">
        <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 rounded text-sm ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            1. List
          </button>
          <button
            type="button"
            onClick={addImage}
            className="px-2 py-1 rounded text-sm hover:bg-gray-200"
          >
            🖼 Image
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className="px-2 py-1 rounded text-sm hover:bg-gray-200 ml-auto"
          >
            ↩
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="px-2 py-1 rounded text-sm hover:bg-gray-200"
          >
            ↪
          </button>
        </div>
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-4 min-h-[300px] focus:outline-none"
        />
      </div>
    </>
  );
}

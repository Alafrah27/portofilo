import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Quote, Heading1, Heading2, 
  Link as LinkIcon, Undo, Redo, Table as TableIcon,
  PlusSquare, Trash2
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-[#2a2a2e] bg-[#0a0a0b] rounded-t-xl sticky top-0 z-10">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-[#1c1c1f] transition-colors ${editor.isActive('bold') ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-gray-400'}`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-[#1c1c1f] transition-colors ${editor.isActive('italic') ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-gray-400'}`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-[#1c1c1f] transition-colors ${editor.isActive('underline') ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-gray-400'}`}
        title="Underline"
      >
        <UnderlineIcon size={18} />
      </button>
      
      <div className="w-[1px] h-6 bg-[#2a2a2e] mx-1 self-center" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-[#1c1c1f] transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-gray-400'}`}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-[#1c1c1f] transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-gray-400'}`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      
      <div className="w-[1px] h-6 bg-[#2a2a2e] mx-1 self-center" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-[#1c1c1f] transition-colors ${editor.isActive('bulletList') ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-gray-400'}`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-[#1c1c1f] transition-colors ${editor.isActive('orderedList') ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-gray-400'}`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-[#1c1c1f] transition-colors ${editor.isActive('blockquote') ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-gray-400'}`}
        title="Blockquote"
      >
        <Quote size={18} />
      </button>
      
      <div className="w-[1px] h-6 bg-[#2a2a2e] mx-1 self-center" />
      
      <button
        type="button"
        onClick={addLink}
        className={`p-2 rounded hover:bg-[#1c1c1f] transition-colors ${editor.isActive('link') ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-gray-400'}`}
        title="Add Link"
      >
        <LinkIcon size={18} />
      </button>

      <button
        type="button"
        onClick={insertTable}
        className={`p-2 rounded hover:bg-[#1c1c1f] transition-colors ${editor.isActive('table') ? 'bg-[#10b981]/20 text-[#10b981]' : 'text-gray-400'}`}
        title="Insert Table"
      >
        <TableIcon size={18} />
      </button>
      
      {editor.isActive('table') && (
        <div className="flex items-center gap-1 bg-[#1c1c1f]/50 px-2 py-1 rounded-lg border border-[#2a2a2e] ml-1 animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="p-1.5 hover:bg-[#10b981]/20 hover:text-[#10b981] text-gray-400 rounded transition-all"
            title="Add Row Below"
          >
            <PlusSquare size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="p-1.5 hover:bg-red-500/20 hover:text-red-500 text-gray-400 rounded transition-all"
            title="Delete Row"
          >
            <Trash2 size={16} />
          </button>
          <div className="w-[1px] h-4 bg-[#2a2a2e] mx-0.5" />
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="p-1.5 hover:bg-[#10b981]/20 hover:text-[#10b981] text-gray-400 rounded transition-all"
            title="Add Column After"
          >
            <PlusSquare size={16} className="rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="p-1.5 hover:bg-red-500/20 hover:text-red-500 text-gray-400 rounded transition-all"
            title="Delete Column"
          >
            <Trash2 size={16} className="rotate-90" />
          </button>
        </div>
      )}
      
      <div className="flex-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-[#1c1c1f] text-gray-400 disabled:opacity-30 transition-colors"
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-[#1c1c1f] text-gray-400 disabled:opacity-30 transition-colors"
        title="Redo"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

const RichTextEditor = ({ content, onChange, placeholder = 'Start typing...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full bg-[#121214] border border-[#2a2a2e] rounded-xl focus-within:border-[#10b981] focus-within:ring-1 focus-within:ring-[#10b981] transition-all overflow-hidden group">
      <MenuBar editor={editor} />
      <div className="p-4 min-h-[250px] prose prose-invert prose-emerald max-w-none">
        <EditorContent editor={editor} className="outline-none" />
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }
        .tiptap {
          outline: none !important;
          min-height: 250px;
        }
        .tiptap p {
          margin: 0.5em 0;
        }
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5em;
        }
        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5em;
        }
        .tiptap blockquote {
          border-left: 3px solid #10b981;
          padding-left: 1em;
          font-style: italic;
          color: #9ca3af;
        }
        .tiptap h1 { font-size: 1.5rem; font-weight: bold; }
        .tiptap h2 { font-size: 1.25rem; font-weight: bold; }
        .tiptap a { color: #10b981; text-decoration: underline; }
        
        /* Table Styles */
        .tiptap table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
          border: 1px solid #2a2a2e;
          border-radius: 8px;
        }
        .tiptap table td, .tiptap table th {
          min-width: 1em;
          border: 1px solid #2a2a2e;
          padding: 3px 5px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }
        .tiptap table th {
          font-weight: bold;
          text-align: left;
          background-color: #1c1c1f;
        }
        .tiptap table .selectedCell:after {
          z-index: 2;
          content: "";
          position: absolute;
          left: 0; right: 0; top: 0; bottom: 0;
          background: rgba(16, 185, 129, 0.1);
          pointer-events: none;
        }
        .tiptap table .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: -2px;
          width: 4px;
          background-color: #10b981;
          pointer-events: none;
        }
      `}} />
    </div>
  );
};

export default RichTextEditor;

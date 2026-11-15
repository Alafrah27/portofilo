import { useEffect, useState } from 'react';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, RemoveFormatting,
  List, ListOrdered, Quote, Code, SquareCode, Minus,
  Link as LinkIcon, Unlink, Undo, Redo, Table as TableIcon, X,
} from 'lucide-react';
import './RichTextEditor.css';

const ToolButton = ({ label, active, disabled, onClick, children }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={`editor-tool ${active ? 'is-active' : ''}`}
  >{children}</button>
);

const MenuBar = ({ editor }) => {
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkError, setLinkError] = useState('');
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      block: current.isActive('heading') ? String(current.getAttributes('heading').level) : 'p',
      bold: current.isActive('bold'),
      italic: current.isActive('italic'),
      underline: current.isActive('underline'),
      strike: current.isActive('strike'),
      code: current.isActive('code'),
      codeBlock: current.isActive('codeBlock'),
      bulletList: current.isActive('bulletList'),
      orderedList: current.isActive('orderedList'),
      blockquote: current.isActive('blockquote'),
      link: current.isActive('link'),
      table: current.isActive('table'),
      undo: current.can().undo(),
      redo: current.can().redo(),
    }),
  });

  const closeLink = () => {
    setShowLink(false);
    setLinkError('');
    editor.chain().focus().run();
  };

  const applyLink = () => {
    const value = linkUrl.trim();
    const href = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : 'https://' + value;
    try {
      const parsed = new URL(href);
      if (!value || !['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol) || (!parsed.pathname && !parsed.hostname)) {
        setLinkError('Enter a valid web, email, or phone link.');
        return;
      }
    } catch {
      setLinkError('Enter a valid link, such as https://example.com.');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    closeLink();
  };

  return (
    <div className="editor-toolbar">
      <div role="group" aria-label="Text formatting" className="editor-tool-row">
        <select
          aria-label="Text style"
          title="Text style"
          className="editor-style-select"
          value={state.block}
          onChange={(event) => {
            if (event.target.value === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: Number(event.target.value) }).run();
          }}
        >
          <option value="p">P · Paragraph</option>
          {[1, 2, 3, 4, 5, 6].map((level) => <option key={level} value={level}>H{level} · Heading {level}</option>)}
        </select>
        <span className="editor-tool-divider" aria-hidden="true" />
        <ToolButton label="Bold" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ToolButton>
        <ToolButton label="Italic" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolButton>
        <ToolButton label="Underline" active={state.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={16} /></ToolButton>
        <ToolButton label="Strikethrough" active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={16} /></ToolButton>
        <ToolButton label="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><RemoveFormatting size={16} /></ToolButton>
        <span className="editor-tool-spacer" />
        <ToolButton label="Undo" disabled={!state.undo} onClick={() => editor.chain().focus().undo().run()}><Undo size={16} /></ToolButton>
        <ToolButton label="Redo" disabled={!state.redo} onClick={() => editor.chain().focus().redo().run()}><Redo size={16} /></ToolButton>
      </div>
      <div role="group" aria-label="Insert and structure" className="editor-tool-row editor-tool-row-secondary">
        <ToolButton label="Bullet list" active={state.bulletList} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></ToolButton>
        <ToolButton label="Numbered list" active={state.orderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></ToolButton>
        <ToolButton label="Blockquote" active={state.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={16} /></ToolButton>
        <span className="editor-tool-divider" aria-hidden="true" />
        <ToolButton label="Inline code" active={state.code} onClick={() => editor.chain().focus().toggleCode().run()}><Code size={16} /></ToolButton>
        <ToolButton label="Code block" active={state.codeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><SquareCode size={16} /></ToolButton>
        <ToolButton label="Horizontal divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={16} /></ToolButton>
        <span className="editor-tool-divider" aria-hidden="true" />
        <ToolButton label={state.link ? 'Edit link' : 'Add link'} active={state.link || showLink} onClick={() => { setLinkUrl(editor.getAttributes('link').href || ''); setLinkError(''); setShowLink((show) => !show); }}><LinkIcon size={16} /></ToolButton>
        <ToolButton label="Remove link" disabled={!state.link} onClick={() => { editor.chain().focus().extendMarkRange('link').unsetLink().run(); setShowLink(false); }}><Unlink size={16} /></ToolButton>
        <ToolButton label="Insert table" active={state.table} disabled={state.table} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon size={16} /></ToolButton>
      </div>

      {showLink && (
        <div role="group" aria-label="Link editor" className="editor-link-panel" onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closeLink(); } }}>
          <div className="editor-link-controls">
            <input
              autoFocus
              aria-label="Link URL"
              aria-invalid={Boolean(linkError)}
              aria-describedby={linkError ? 'editor-link-error' : undefined}
              type="text"
              inputMode="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(event) => { setLinkUrl(event.target.value); setLinkError(''); }}
              onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); applyLink(); } }}
            />
            <button type="button" className="editor-text-tool" onClick={applyLink}>Apply link</button>
            <ToolButton label="Cancel link" onClick={closeLink}><X size={15} /></ToolButton>
          </div>
          {linkError && <p role="alert" id="editor-link-error" className="editor-link-error">{linkError}</p>}
        </div>
      )}

      {state.table && (
        <div role="group" aria-label="Table controls" className="editor-table-tools">
          <button type="button" className="editor-text-tool" onClick={() => editor.chain().focus().addRowAfter().run()}>+ Row</button>
          <button type="button" className="editor-text-tool" onClick={() => editor.chain().focus().addColumnAfter().run()}>+ Column</button>
          <button type="button" className="editor-text-tool" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>Header row</button>
          <button type="button" className="editor-text-tool" onClick={() => editor.chain().focus().deleteRow().run()}>Delete row</button>
          <button type="button" className="editor-text-tool" onClick={() => editor.chain().focus().deleteColumn().run()}>Delete column</button>
          <button type="button" className="editor-text-tool editor-delete-tool" onClick={() => editor.chain().focus().deleteTable().run()}>Delete table</button>
        </div>
      )}
    </div>
  );
};

const EditorCount = ({ editor }) => {
  const text = useEditorState({ editor, selector: ({ editor: current }) => current.getText({ blockSeparator: ' ' }) });
  const wordCount = text.trim() ? text.trim().split(/\s+/u).length : 0;
  const characterCount = Array.from(text.trimEnd()).length;
  return <div className="editor-count"><span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span><span>{characterCount} {characterCount === 1 ? 'character' : 'characters'}</span></div>;
};

const RichTextEditor = ({ content, onChange, placeholder = 'Start typing...', ariaLabelledBy, readOnly = false, disabled = false }) => {
  const editor = useEditor({
    editable: !readOnly && !disabled,
    extensions: [
      StarterKit.configure({ link: false, underline: false, heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      Link.configure({ openOnClick: false, defaultProtocol: 'https' }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-readonly': String(readOnly || disabled),
        'aria-multiline': 'true',
        ...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : { 'aria-label': 'Rich text editor' }),
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  useEffect(() => { editor?.setEditable(!readOnly && !disabled); }, [editor, readOnly, disabled]);

  return (
    <div className="rich-editor">
      {editor && !readOnly && <MenuBar editor={editor} />}
      <div className="editor-writing-area"><EditorContent editor={editor} /></div>
      {editor && <EditorCount editor={editor} />}
    </div>
  );
};

export default RichTextEditor;

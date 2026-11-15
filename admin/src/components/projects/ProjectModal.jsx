import { useEffect, useRef } from 'react';
import { ImagePlus, Plus, X, Save, Edit3 } from 'lucide-react';
import RichTextEditor from '../RichTextEditor';

export default function ProjectModal({ isOpen, mode, onClose, formData, setFormData, images, existingImages,
  saving, error, onEdit, handleSubmit, fileInputRef, isDragging, handleDragOver, handleDragLeave,
  handleDrop, handleFileInput, removeImage, clearImages }) {
  const dialogRef = useRef(null);
  const titleRef = useRef(null);
  const preview = mode === 'preview';
  const displayedImages = images.length ? images : existingImages.map((image, index) => ({
    id: image.publicId, preview: image.url, name: `Image ${index + 1}`, existing: true,
  }));

  useEffect(() => {
    if (isOpen) { dialogRef.current?.showModal(); titleRef.current?.focus(); }
    else dialogRef.current?.close();
  }, [isOpen]);

  return <dialog ref={dialogRef} aria-labelledby="project-dialog-title"
    onCancel={(event) => { event.preventDefault(); if (!saving) onClose(); }}
    className="fixed inset-0 m-auto max-h-[94dvh] w-[calc(100%-2rem)] max-w-[960px] overflow-hidden rounded-xl border border-[#29292d] bg-[#090909] p-0 text-gray-300 backdrop:bg-black/80">
    {isOpen && <form onSubmit={handleSubmit} aria-busy={saving} className="flex max-h-[calc(94dvh-2px)] flex-col">
      <header className="flex shrink-0 items-start justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6">
        <div><p className="mb-2 flex items-center gap-2 text-[10px] text-gray-500">Portfolio <span className="text-gray-700">/</span> Case studies</p>
          <h2 id="project-dialog-title" className="text-xl font-semibold tracking-tight text-white">{preview ? 'Case study preview' : mode === 'edit' ? 'Edit case study' : 'New case study'}</h2></div>
        <button type="button" disabled={saving} onClick={onClose} aria-label="Close project dialog" className="rounded-md p-1.5 text-gray-500 hover:bg-white/5 hover:text-white"><X size={18} /></button>
      </header>
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain" role="region" aria-label="Project details" tabIndex={0}>
      <fieldset disabled={saving} className="min-w-0 border-0 p-0">
        {error && <p role="alert" className="mx-5 mb-2 rounded-lg border border-red-500/25 bg-red-500/5 p-3 text-sm text-red-300 sm:mx-7">{error}</p>}
        <div className="grid md:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0 space-y-6 px-5 py-6 sm:px-7">
            <div><label htmlFor="project-title" className="mb-2.5 block text-xs font-medium text-gray-200">Project name <span aria-hidden="true" className="text-primary-400">*</span></label>
              <input id="project-title" ref={titleRef} name="title" required maxLength={200} readOnly={preview}
                placeholder="Give your project a name" value={formData.title}
                onChange={(event) => setFormData((data) => ({ ...data, title: event.target.value }))} className="admin-input w-full" /></div>
            <div><label htmlFor="project-website-url" className="mb-2.5 block text-xs font-medium text-gray-200">Live website URL <span className="font-normal text-gray-500">(optional)</span></label>
              <input id="project-website-url" name="websiteUrl" type="url" maxLength={2048} readOnly={preview}
                placeholder="https://your-project.com" value={formData.websiteUrl || ''}
                onChange={(event) => setFormData((data) => ({ ...data, websiteUrl: event.target.value }))} className="admin-input w-full" />
              {preview && formData.websiteUrl && <a href={formData.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-primary-400 hover:text-primary-300">Open live website ↗</a>}
            </div>
            <div><label id="project-story-label" className="mb-2.5 block text-xs font-medium text-gray-200">Project story <span aria-hidden="true" className="text-primary-400">*</span></label>
              <RichTextEditor ariaLabelledBy="project-story-label" content={formData.description} readOnly={preview} disabled={saving}
                onChange={(description) => setFormData((data) => ({ ...data, description }))}
                placeholder="What was the challenge, and how did you solve it?" /></div>
          </div>
          <aside aria-label="Project images" className="space-y-5 border-t border-[#242427] bg-[#0d0d0e] px-5 py-6 sm:px-7 md:border-l md:border-t-0 md:px-5">
            <div className="flex items-center justify-between"><h3 className="text-xs font-medium text-gray-200">Project images <span aria-hidden="true" className="text-primary-400">*</span></h3><span className="text-[10px] text-gray-500">{displayedImages.length}/10</span></div>
            {!preview && <div>
              <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" aria-label="Upload project images" onChange={handleFileInput} className="sr-only" tabIndex={-1} />
              <button type="button" onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                className={`flex w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-7 text-center ${isDragging ? 'border-primary-500 bg-primary-500/5' : 'border-[#39393e] hover:border-gray-500'}`}>
                <ImagePlus size={24} strokeWidth={1.4} className="text-gray-500" /><span className="text-xs text-primary-400">{existingImages.length ? 'Choose replacement images' : 'Choose images'}</span><span className="text-[10px] text-gray-500">or drag & drop here</span>
              </button>
              <p className="mt-3 text-[10px] leading-5 text-gray-500">JPEG, PNG, WebP · Up to 5MB each.<br />The first image is your project cover.</p>
              {existingImages.length > 0 && <p className="mt-2 text-[10px] leading-5 text-gray-400">New images replace the current gallery. Without new images, your gallery stays the same.</p>}
              {existingImages.length > 0 && images.length > 0 && <button type="button" onClick={clearImages} className="mt-2 text-xs text-primary-400">Keep current images</button>}
            </div>}
            {displayedImages.length > 0 && <ul aria-label="Project image gallery" className="space-y-2">
              {displayedImages.map((image, index) => <li key={image.id} className="flex items-center gap-2.5 rounded-md border border-[#29292d] p-2">
                {preview ? <a href={image.preview} target="_blank" rel="noreferrer" aria-label={`Open image ${index + 1}`}><img src={image.preview} alt={`Project image ${index + 1}`} className="h-14 w-16 rounded object-cover" /></a> : <img src={image.preview} alt="" className="h-9 w-10 shrink-0 rounded object-cover" />}
                <div className="min-w-0 flex-1"><p className="truncate text-[10px] text-gray-300">{image.file?.name || image.name}</p><p className="mt-1 text-[9px] text-gray-500">{index === 0 ? 'Cover image' : 'Gallery image'}</p></div>
                {!preview && !image.existing && <button type="button" onClick={() => removeImage(image.id)} aria-label={`Remove ${image.file.name}`} className="rounded p-1 text-gray-500 hover:text-white"><X size={13} /></button>}
              </li>)}
            </ul>}
          </aside>
        </div>
      </fieldset>
      </div>
      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 bg-[#090909] px-5 py-4 sm:px-7">
        <span role="status" className="text-[10px] text-gray-500">{saving ? 'Saving project and images…' : preview ? '' : '* Required fields'}</span>
        <div className="ml-auto flex items-center gap-2.5"><button type="button" disabled={saving} onClick={onClose} className="btn-secondary">{preview ? 'Close' : 'Cancel'}</button>
          {preview ? <button type="button" onClick={onEdit} className="btn-primary"><Edit3 size={16} />Edit case study</button>
            : <button type="submit" disabled={saving} className="btn-primary">{mode === 'edit' ? <Save size={16} /> : <Plus size={16} />}{saving ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create case study'}</button>}
        </div>
      </footer>
    </form>}
  </dialog>;
}

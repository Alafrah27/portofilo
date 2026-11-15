import { useEffect, useRef } from 'react';

export default function ProjectDeleteDialog({ project, deleting, error, onClose, onConfirm }) {
  const dialog = useRef(null);
  useEffect(() => {
    if (project) dialog.current?.showModal();
    else dialog.current?.close();
  }, [project]);
  return <dialog ref={dialog} aria-labelledby="delete-project-title" onCancel={(event) => { event.preventDefault(); if (!deleting) onClose(); }}
    className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-[#29292d] bg-[#090909] p-6 text-gray-300 backdrop:bg-black/80">
    <h2 id="delete-project-title" className="text-lg font-semibold text-white">Delete project?</h2>
    <p className="mt-3 text-sm leading-6 text-gray-400">“{project?.title}” and its images will be permanently deleted.</p>
    {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    <div className="mt-6 flex justify-end gap-3"><button type="button" disabled={deleting} onClick={onClose} className="btn-secondary">Cancel</button>
      <button type="button" disabled={deleting} onClick={onConfirm} className="btn-secondary border-red-500/40 text-red-300">{deleting ? 'Deleting…' : 'Delete project'}</button></div>
  </dialog>;
}

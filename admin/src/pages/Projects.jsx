import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import ProjectTable from '../components/projects/ProjectTable';
import ProjectModal from '../components/projects/ProjectModal';
import ProjectDeleteDialog from '../components/projects/ProjectDeleteDialog';
import { projectsApi, validateImages } from '../projects/projectClient.js';

const emptyForm = { title: '', description: '', websiteUrl: '' };

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState(() => searchParams.get('new') === '1' ? 'create' : null);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const previews = useRef(new Set());
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [opening, setOpening] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const busy = useRef(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    projectsApi.list().then((data) => {
      if (active) setProjects((current) => [...current, ...data.filter((project) => !current.some((item) => item._id === project._id))]);
    })
      .catch((failure) => { if (active) setError(failure.message); })
      .finally(() => { if (active) setLoading(false); });
    const urls = previews.current;
    return () => { active = false; urls.forEach((url) => URL.revokeObjectURL(url)); urls.clear(); };
  }, []);

  async function reload() {
    setLoading(true);
    setError('');
    try { setProjects(await projectsApi.list()); }
    catch (failure) { setError(failure.message); }
    finally { setLoading(false); }
  }

  function clearImages() {
    previews.current.forEach((url) => URL.revokeObjectURL(url));
    previews.current.clear();
    setImages([]);
  }

  function close() {
    if (busy.current) return;
    clearImages();
    setSelected(null);
    setFormData(emptyForm);
    setFormError('');
    setIsDragging(false);
    setMode(null);
    if (searchParams.has('new')) {
      const next = new URLSearchParams(searchParams);
      next.delete('new');
      setSearchParams(next, { replace: true });
    }
  }

  async function open(project, nextMode) {
    if (busy.current) return;
    busy.current = true;
    setOpening(project._id);
    setError('');
    try {
      const latest = await projectsApi.get(project._id);
      clearImages();
      setSelected(latest);
      setFormData({ title: latest.title, description: latest.description, websiteUrl: latest.websiteUrl || '' });
      setFormError('');
      setMode(nextMode);
    } catch (failure) { setError(failure.message); }
    finally { busy.current = false; setOpening(null); }
  }

  function handleFiles(files) {
    if (busy.current || mode === 'preview') return;
    const incoming = Array.from(files);
    try {
      validateImages([...images.map((image) => image.file), ...incoming]);
      const added = incoming.map((file) => {
        const preview = URL.createObjectURL(file);
        previews.current.add(preview);
        return { file, preview, id: crypto.randomUUID() };
      });
      setImages((current) => [...current, ...added]);
      setFormError('');
    } catch (failure) { setFormError(failure.message); }
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeImage(id) {
    const image = images.find((item) => item.id === id);
    if (image) { URL.revokeObjectURL(image.preview); previews.current.delete(image.preview); }
    setImages((current) => current.filter((item) => item.id !== id));
  }

  async function save(event) {
    event.preventDefault();
    if (busy.current || mode === 'preview') return;
    busy.current = true;
    setSaving(true);
    setFormError('');
    let saved = false;
    try {
      const data = { ...formData, files: images.map((image) => image.file) };
      const project = mode === 'edit' ? await projectsApi.update(selected._id, data) : await projectsApi.create(data);
      setProjects((current) => mode === 'edit'
        ? current.map((item) => item._id === project._id ? project : item)
        : [project, ...current]);
      saved = true;
    } catch (failure) { setFormError(failure.message); }
    finally { busy.current = false; setSaving(false); }
    if (saved) close();
  }

  async function confirmDelete() {
    if (busy.current || !deleteTarget) return;
    busy.current = true;
    setDeleting(true);
    setDeleteError('');
    try {
      await projectsApi.remove(deleteTarget._id);
      setProjects((current) => current.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (failure) { setDeleteError(failure.message); }
    finally { busy.current = false; setDeleting(false); }
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="eyebrow mb-3"><span className="w-8 h-[2px] bg-[#10b981]" /><span>Selected work</span></div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Your <span className="gradient-text">projects.</span></h1>
          <p className="text-gray-400 mt-2 max-w-md text-sm leading-relaxed">Manage the projects and case studies behind your portfolio.</p>
        </div>
        <button disabled={loading || !!opening} onClick={() => { setFormData(emptyForm); setSelected(null); setFormError(''); clearImages(); setMode('create'); }} className="btn-primary w-full sm:w-auto"><Plus size={17} />New Project</button>
      </div>
      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-300"><span>{error}</span><button type="button" onClick={reload} disabled={loading} className="btn-secondary">Retry</button></div>}
      {loading ? <p role="status" className="py-12 text-center text-sm text-gray-400">Loading projects…</p> : <ProjectTable projects={projects} opening={opening} onEdit={(project) => open(project, 'edit')} onPreview={(project) => open(project, 'preview')} onDelete={(project) => { setDeleteError(''); setDeleteTarget(project); }} />}
      {!loading && <p className="text-xs text-gray-500">Showing {projects.length} {projects.length === 1 ? 'project' : 'projects'}</p>}
      <ProjectModal key={`${mode}-${selected?._id || 'new'}`} isOpen={!!mode} mode={mode} onClose={close}
        formData={formData} setFormData={setFormData} images={images} existingImages={selected?.images || []}
        saving={saving} error={formError} onEdit={() => setMode('edit')} handleSubmit={save} fileInputRef={fileInputRef}
        isDragging={isDragging} handleDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
        handleDragLeave={(event) => { event.preventDefault(); setIsDragging(false); }}
        handleDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFiles(event.dataTransfer.files); }}
        handleFileInput={(event) => handleFiles(event.target.files)} removeImage={removeImage} clearImages={clearImages} />
      <ProjectDeleteDialog project={deleteTarget} deleting={deleting} error={deleteError} onConfirm={confirmDelete}
        onClose={() => { if (!busy.current) setDeleteTarget(null); }} />
    </div>
  );
}

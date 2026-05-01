import { useState, useRef } from 'react';
import { Plus, X, UploadCloud, Image as ImageIcon, Briefcase, FileText } from 'lucide-react';

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    status: 'development',
  });
  const [images, setImages] = useState([]);

  // Mock Data
  const [projects, setProjects] = useState([
    { id: 1, title: 'E-Commerce Platform', subtitle: 'A modern shopping experience', status: 'development', imageCount: 3 },
    { id: 2, title: 'Mobile Banking App', subtitle: 'Secure finance on the go', status: 'planning', imageCount: 0 },
    { id: 3, title: 'Internal Dashboard', subtitle: 'Company metrics tracker', status: 'completed', imageCount: 5 },
  ]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <span className="badge badge-green">Completed</span>;
      case 'development': return <span className="badge badge-blue">Development</span>;
      case 'planning': return <span className="badge badge-yellow">Planning</span>;
      default: return <span className="badge badge-gray">{status}</span>;
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (idToRemove) => {
    setImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add to mock state
    const newProject = {
      id: Date.now(),
      title: formData.title,
      subtitle: formData.subtitle,
      status: formData.status,
      imageCount: images.length
    };
    
    setProjects([newProject, ...projects]);
    
    // Reset and close
    setFormData({ title: '', subtitle: '', description: '', status: 'development' });
    setImages([]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Case Studies</h2>
          <p className="text-gray-400 mt-1">Manage your featured projects and portfolio items.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary gap-2 shadow-lg shadow-[#10b981]/20 hover:shadow-[#10b981]/40"
        >
          <Plus size={18} /> New Case Study
        </button>
      </div>

      <div className="admin-card overflow-hidden border-[#1c1c1f]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121214] border-b border-[#2a2a2e]">
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Project / Case Study</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assets</th>
                <th className="p-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1f]">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-[#121214]/50 transition-colors group">
                  <td className="p-5">
                    <p className="text-sm font-semibold text-white group-hover:text-[#10b981] transition-colors">{project.title}</p>
                    <p className="text-xs text-gray-500 mt-1.5">{project.subtitle}</p>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-[#121214] px-2.5 py-1.5 border border-[#2a2a2e] rounded-lg inline-flex shadow-sm">
                      <ImageIcon size={14} className={project.imageCount > 0 ? "text-[#06b6d4]" : "text-gray-500"} /> 
                      {project.imageCount} Images
                    </div>
                  </td>
                  <td className="p-5">{getStatusBadge(project.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Case Study Builder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0a0a0b]/80 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-[#121214] border border-[#2a2a2e] shadow-2xl rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#1c1c1f] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Create Case Study</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Add a new project to your featured portfolio</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white bg-[#1c1c1f] hover:bg-[#2a2a2e] p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body - Two Column Layout */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <form id="case-study-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                
                {/* Left Column: Text Data (3/5 width) */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} className="text-[#10b981]" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Project Details</h3>
                  </div>

                  <div className="space-y-5 bg-[#0a0a0b] p-6 rounded-xl border border-[#1c1c1f]">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Project Title</label>
                      <input 
                        type="text" 
                        className="w-full bg-[#121214] border border-[#2a2a2e] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-white rounded-lg px-4 py-2.5 text-sm transition-all" 
                        placeholder="e.g. Acme Corp Rebrand" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Subtitle / Short Summary</label>
                      <input 
                        type="text" 
                        className="w-full bg-[#121214] border border-[#2a2a2e] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-white rounded-lg px-4 py-2.5 text-sm transition-all" 
                        placeholder="e.g. A complete digital transformation..." 
                        value={formData.subtitle}
                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                        required 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Project Status</label>
                        <select 
                          className="w-full bg-[#121214] border border-[#2a2a2e] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-white rounded-lg px-4 py-2.5 text-sm transition-all appearance-none"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                          <option value="planning">Planning Phase</option>
                          <option value="development">In Development</option>
                          <option value="completed">Completed / Published</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">Full Description</label>
                      <textarea 
                        className="w-full bg-[#121214] border border-[#2a2a2e] focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] text-white rounded-lg px-4 py-3 text-sm transition-all min-h-[160px] resize-y" 
                        placeholder="Describe the challenge, the solution, and the results..."
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Right Column: Media (2/5 width) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon size={16} className="text-[#06b6d4]" />
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Media Assets</h3>
                  </div>

                  <div className="bg-[#0a0a0b] p-6 rounded-xl border border-[#1c1c1f] h-[calc(100%-2rem)] flex flex-col">
                    {/* Premium Drag and Drop Zone */}
                    <div 
                      className={`relative overflow-hidden border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer flex-1 flex flex-col items-center justify-center min-h-[200px] ${
                        isDragging 
                          ? 'border-[#10b981] bg-[#10b981]/5 shadow-[0_0_30px_rgba(16,185,129,0.1)_inset]' 
                          : 'border-[#2a2a2e] bg-[#121214] hover:border-[#06b6d4]/50 hover:bg-[#06b6d4]/5'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        ref={fileInputRef}
                        onChange={handleFileInput}
                      />
                      
                      {/* Decorative background blur */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/5 to-[#06b6d4]/5 opacity-50"></div>
                      
                      <div className="relative z-10 flex flex-col items-center space-y-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200 ${
                          isDragging ? 'bg-[#10b981] text-white shadow-lg shadow-[#10b981]/30' : 'bg-[#1c1c1f] text-gray-400'
                        }`}>
                          <UploadCloud size={28} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            <span className="text-[#06b6d4]">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-2">SVG, PNG, JPG or WEBP (max. 5MB)</p>
                        </div>
                      </div>
                    </div>

                    {/* Image Previews Grid */}
                    {images.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-semibold text-gray-400 uppercase">Attached Files</p>
                          <span className="text-xs bg-[#1c1c1f] px-2 py-1 rounded text-white font-medium">{images.length}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto custom-scrollbar pr-2">
                          {images.map((img) => (
                            <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden border border-[#2a2a2e] shadow-sm">
                              <img 
                                src={img.preview} 
                                alt="Preview" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                              <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500/90 text-white rounded-md hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-[-10px] group-hover:translate-y-0"
                              >
                                <X size={14} strokeWidth={2.5} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-[#1c1c1f] flex justify-end gap-3 shrink-0 bg-[#0a0a0b] rounded-b-2xl">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)} 
                className="px-5 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-[#1c1c1f] transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="case-study-form"
                className="btn-primary shadow-lg shadow-[#10b981]/20 hover:shadow-[#10b981]/40 px-6 py-2.5 text-sm"
              >
                Save Case Study
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;

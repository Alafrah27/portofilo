import { useState, useRef } from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import ProjectTable from '../components/projects/ProjectTable';
import ProjectModal from '../components/projects/ProjectModal';

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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
    { 
      id: 1, 
      title: 'E-Commerce Platform', 
      subtitle: 'A modern shopping experience for global retail', 
      status: 'development', 
      imageCount: 3,
      thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=100&h=100&fit=crop',
      updatedAt: '2 hours ago'
    },
    { 
      id: 2, 
      title: 'Mobile Banking App', 
      subtitle: 'Secure finance on the go with biometric auth', 
      status: 'planning', 
      imageCount: 0,
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&h=100&fit=crop',
      updatedAt: '1 day ago'
    },
    { 
      id: 3, 
      title: 'Internal Dashboard', 
      subtitle: 'Company metrics tracker with real-time data', 
      status: 'completed', 
      imageCount: 5,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop',
      updatedAt: '3 days ago'
    },
  ]);

  const handleFiles = (files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const newProject = {
      id: Date.now(),
      title: formData.title,
      subtitle: formData.subtitle,
      status: formData.status,
      imageCount: images.length,
      thumbnail: images[0]?.preview || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=100&h=100&fit=crop',
      updatedAt: 'Just now'
    };
    setProjects([newProject, ...projects]);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', description: '', status: 'development' });
    setImages([]);
    setCurrentStep(1);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-[#10b981]"></span>
            <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-[0.3em]">Portfolio Engine</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Case Studies</h2>
          <p className="text-gray-400 mt-2 max-w-md text-sm leading-relaxed">
            Curate and manage your featured projects. Showcase your best work with high-fidelity visuals and storytelling.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary w-full sm:w-auto gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-bold group flex justify-center items-center"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:scale-110 transition-transform">
            <Plus size={16} />
          </div>
          New Project
        </button>
      </div>

      <ProjectTable projects={projects} />

      <div className="p-4 bg-[#0a0a0b]/50 border border-white/5 rounded-2xl flex justify-center">
        <button className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2">
          Load More Projects <MoreHorizontal size={14} />
        </button>
      </div>

      <ProjectModal 
        isOpen={isModalOpen}
        onClose={resetForm}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        formData={formData}
        setFormData={setFormData}
        images={images}
        setImages={setImages}
        handleSubmit={handleSubmit}
        fileInputRef={fileInputRef}
        isDragging={isDragging}
        handleDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        handleDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        handleDrop={handleDrop}
        handleFileInput={handleFileInput}
        removeImage={(id) => setImages(prev => prev.filter(img => img.id !== id))}
      />
    </div>
  );
};

export default Projects;

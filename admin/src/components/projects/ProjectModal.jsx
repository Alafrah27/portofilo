import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Briefcase, Info, FileText, Image as ImageIcon, 
  CheckCircle2, ChevronLeft, ChevronRight, UploadCloud 
} from 'lucide-react';
import RichTextEditor from '../RichTextEditor';

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  currentStep, 
  setCurrentStep, 
  formData, 
  setFormData, 
  images, 
  setImages, 
  handleSubmit,
  fileInputRef,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileInput,
  removeImage
}) => {
  const steps = [
    { id: 1, title: 'General Info', icon: <Info size={18} />, description: 'Basic project identity' },
    { id: 2, title: 'Project Story', icon: <FileText size={18} />, description: 'Detailed case study content' },
    { id: 3, title: 'Media Assets', icon: <ImageIcon size={18} />, description: 'Showcase visuals' },
  ];

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: 'easeIn' } }
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-[#0a0a0b]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#121214] border border-[#2a2a2e] shadow-2xl rounded-3xl w-full max-w-4xl max-h-[95vh] flex flex-col relative overflow-hidden"
          >
            
            {/* Stepper Header */}
            <div className="bg-[#0a0a0b] border-b border-[#1c1c1f] px-4 sm:px-8 pt-8 pb-6 shrink-0">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-none">New Case Study</h2>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 font-bold uppercase tracking-widest">Step {currentStep} of 3</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-white bg-[#1c1c1f] hover:bg-[#2a2a2e] p-2.5 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center justify-between max-w-2xl mx-auto px-4 relative">
                {/* Progress Line */}
                <div className="absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-[#1c1c1f] z-0">
                  <div 
                    className="h-full bg-[#10b981] transition-all duration-500 ease-out" 
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                  />
                </div>

                {steps.map((step) => (
                  <div key={step.id} className="relative z-10 flex flex-col items-center">
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                        currentStep >= step.id 
                          ? 'bg-[#10b981] border-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                          : 'bg-[#121214] border-[#2a2a2e] text-gray-500'
                      }`}
                    >
                      {currentStep > step.id ? <CheckCircle2 size={18} /> : step.icon}
                    </div>
                    <p className={`mt-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 hidden sm:block ${
                      currentStep >= step.id ? 'text-white' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 bg-[#121214]">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div 
                    key="step1"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6 max-w-2xl mx-auto"
                  >
                    <div className="bg-[#0a0a0b] p-6 sm:p-10 rounded-3xl border border-[#1c1c1f] space-y-8">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em]">Project Identity</label>
                        <input 
                          type="text" 
                          className="admin-input w-full" 
                          placeholder="e.g. Next-Gen FinTech Dashboard" 
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em]">Brief Synopsis</label>
                        <input 
                          type="text" 
                          className="admin-input w-full" 
                          placeholder="A concise impact statement..." 
                          value={formData.subtitle}
                          onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-500 mb-4 uppercase tracking-[0.2em]">Current Status</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {['planning', 'development', 'completed'].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setFormData({...formData, status})}
                              className={`px-4 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest border transition-all ${
                                formData.status === status 
                                  ? 'bg-[#10b981]/10 border-[#10b981]/40 text-[#10b981] shadow-lg shadow-[#10b981]/5' 
                                  : 'bg-[#121214] border-[#2a2a2e] text-gray-500 hover:border-gray-600'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div 
                    key="step2"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-[#10b981]" />
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">The Narrative</h3>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium italic">Articulate the challenge and the solution</p>
                    </div>
                    <RichTextEditor 
                      content={formData.description}
                      onChange={(html) => setFormData({...formData, description: html})}
                      placeholder="Begin your story here..."
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div 
                    key="step3"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-8"
                  >
                    <div 
                      className={`relative border-2 border-dashed rounded-[2rem] p-8 sm:p-16 text-center transition-all duration-500 cursor-pointer ${
                        isDragging 
                          ? 'border-[#10b981] bg-[#10b981]/5 shadow-[0_0_60px_rgba(16,185,129,0.1)_inset]' 
                          : 'border-[#2a2a2e] bg-[#0a0a0b] hover:border-[#10b981]/30 group'
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
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-20 h-20 rounded-[2rem] bg-[#1c1c1f] flex items-center justify-center text-gray-500 group-hover:text-[#10b981] group-hover:scale-110 transition-all duration-500">
                          <UploadCloud size={40} strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-white font-black text-xl tracking-tight">Import Visual Assets</p>
                          <p className="text-xs text-gray-600 font-bold uppercase tracking-[0.1em] mt-3">Drag & Drop or Click to Browse</p>
                        </div>
                        <button type="button" className="bg-[#1c1c1f] hover:bg-[#2a2a2e] text-white px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all border border-[#2a2a2e]">Open Explorer</button>
                      </div>
                    </div>

                    {images.length > 0 && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Asset Library</h4>
                          <span className="text-[10px] bg-[#10b981]/10 text-[#10b981] px-4 py-1.5 rounded-xl font-black uppercase tracking-widest border border-[#10b981]/20">{images.length} Objects</span>
                        </div>
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
                          {images.map((img) => (
                            <div key={img.id} className="relative group aspect-video rounded-2xl overflow-hidden border border-[#2a2a2e] bg-[#0a0a0b] shadow-xl">
                              <img 
                                src={img.preview} 
                                alt="Preview" 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125"
                              />
                              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <button 
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                                  className="w-12 h-12 bg-red-500/20 text-red-500 border border-red-500/40 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform scale-90 group-hover:scale-100"
                                >
                                  <X size={20} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-8 py-6 border-t border-[#1c1c1f] flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0 bg-[#0a0a0b]">
              <button 
                type="button" 
                onClick={currentStep === 1 ? onClose : handleBackStep} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-gray-500 hover:text-white hover:bg-[#1c1c1f] transition-all text-[11px] uppercase tracking-[0.2em]"
              >
                {currentStep === 1 ? 'Abort Session' : <><ChevronLeft size={16} /> Previous Step</>}
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentStep < 3 ? (
                  <button 
                    type="button" 
                    onClick={handleNextStep}
                    className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#10b981]/10"
                  >
                    Next Phase <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleSubmit}
                    className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#10b981]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <CheckCircle2 size={16} /> Finalize Case Study
                  </button>
                ) }
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;

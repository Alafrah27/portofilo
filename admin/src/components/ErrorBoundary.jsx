import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-['Poppins']">
          {/* Background Accents */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#10b981]/5 rounded-full blur-[120px]"></div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl z-10"
          >
            <div className="admin-card p-12 text-center relative overflow-hidden border-red-500/20">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
              
              <div className="w-24 h-24 rounded-[2.5rem] bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-10 shadow-2xl shadow-red-500/10">
                <AlertTriangle size={48} />
              </div>

              <h1 className="text-4xl font-black text-white tracking-tight mb-4">
                System <span className="text-red-500">Anomaly.</span>
              </h1>
              
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 max-w-sm mx-auto">
                The interface encountered an unexpected state. Our core engine has safely isolated the issue to prevent data loss.
              </p>

              <div className="bg-[#0a0a0b] border border-white/5 rounded-2xl p-6 mb-10 text-left overflow-x-auto custom-scrollbar">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Error Log
                </p>
                <code className="text-xs text-gray-500 block font-mono leading-relaxed">
                  {this.state.error?.message || "An unknown error occurred within the render cycle."}
                </code>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Hot Reload
                </button>
                <button 
                  onClick={this.handleReset}
                  className="btn-primary px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-2"
                >
                  <Home size={16} /> Back to Studio
                </button>
              </div>
            </div>
            
            <p className="text-center mt-12 text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
              Security Protocol v1.0.0 Active
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

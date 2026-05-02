import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Heart, Sparkles, User, Zap } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden font-['Poppins']">
      
      {/* Soft Mesh Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#10b981]/10 rounded-full blur-[160px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#06b6d4]/10 rounded-full blur-[160px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[460px] z-10"
      >
        {/* Welcome Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#06b6d4]">Back.</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Please authenticate to access your studio.</p>
        </div>

        {/* Beautiful Login Form */}
        <div className="admin-card p-10 sm:p-12 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent"></div>
          
          <form className="space-y-8" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Work Email</label>
              <div className="relative group/input">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-[#10b981] transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="ali@musdar.com"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-[#10b981]/40 focus:ring-4 focus:ring-[#10b981]/5 text-white rounded-[1.5rem] py-5 pl-14 pr-6 text-sm transition-all placeholder:text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Security Key</label>
                <button type="button" className="text-[10px] font-black text-[#06b6d4] uppercase tracking-widest hover:text-white transition-colors">Forgot?</button>
              </div>
              <div className="relative group/input">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-[#06b6d4] transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="Your secret key"
                  className="w-full bg-white/[0.02] border border-white/10 focus:border-[#06b6d4]/40 focus:ring-4 focus:ring-[#06b6d4]/5 text-white rounded-[1.5rem] py-5 pl-14 pr-14 text-sm transition-all placeholder:text-gray-700"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full btn-primary py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.25em] flex items-center justify-center gap-4 group/btn relative overflow-hidden active:scale-[0.98] transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Enter Studio <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
              <Sparkles size={12} className="text-[#10b981]" /> Powered by Musdar Engine v2.0
            </p>
          </div>
        </div>


      </motion.div>
    </div>
  );
};

export default Login;

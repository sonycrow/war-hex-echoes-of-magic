import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  lang: 'es' | 'en';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  title,
  lang 
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="relative bg-white rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in duration-300 border border-white/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-10 py-6 border-b border-slate-50">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {lang === 'es' ? 'Inspección de Registro' : 'Entry Inspection'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="text-slate-300 hover:text-slate-900 transition-colors p-2 rounded-xl hover:bg-slate-50"
            >
              <X size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
        
        <div className="p-10 flex justify-center bg-slate-50/50 min-h-[500px] relative overflow-hidden">
           <div className="relative group">
              <div className="absolute -inset-4 bg-slate-900/5 rounded-[2.5rem] blur-xl group-hover:bg-slate-900/10 transition-all duration-500"></div>
              <img 
                src={imageUrl} 
                alt={title} 
                className="relative max-h-[65vh] object-contain rounded-[2rem] shadow-2xl bg-white border border-white"
              />
           </div>
        </div>
        
        <div className="px-10 py-6 bg-white border-t border-slate-50 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            War-Hex Codex Artifact Preservation System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
import React, { useEffect } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  onGenerate: () => void;
  isGenerating: boolean;
  lang: 'es' | 'en';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  title, 
  onGenerate, 
  isGenerating,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isGenerating 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200 hover:text-amber-900'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {lang === 'es' ? 'Generando...' : 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  {lang === 'es' ? 'Generar Arte IA' : 'Magic Paint'}
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6 flex justify-center bg-slate-50 min-h-[400px] relative">
           {isGenerating && (
             <div className="absolute inset-0 z-10 bg-white/60 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 size={48} className="text-amber-500 animate-spin mb-4" />
                <p className="text-slate-600 font-medium animate-pulse">
                  {lang === 'es' ? 'Invocando al artista...' : 'Summoning the artist...'}
                </p>
             </div>
           )}
          <img 
            src={imageUrl} 
            alt={title} 
            className="max-h-[70vh] object-contain rounded-lg shadow-md bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Modal;
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

interface LanguageSelectorProps {
    currentLang: 'es' | 'en';
    onLangChange: (lang: 'es' | 'en') => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLangChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'es', label: 'Español' },
        { code: 'en', label: 'English' }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all duration-300 group"
            >
                <div className="flex items-center gap-3">
                    <Globe size={18} className="text-slate-400 group-hover:text-slate-900" />
                    <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                        {currentLang === 'es' ? 'Español' : 'English'}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200 z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                onLangChange(lang.code as 'es' | 'en');
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-sm font-bold transition-all ${currentLang === lang.code
                                    ? 'bg-slate-900 text-white'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            {lang.label.toUpperCase()}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;

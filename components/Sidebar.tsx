import React from 'react';
import { X, Swords, ScrollText, Map, BookOpen, Layers } from 'lucide-react';
import NavLink from './NavLink';
import LanguageSelector from './LanguageSelector';
import { ViewState } from '../types';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    currentView: ViewState;
    onNav: (view: ViewState) => void;
    lang: 'es' | 'en';
    onLangChange: (lang: 'es' | 'en') => void;
    t: any; // Localized strings
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    currentView,
    onNav,
    lang,
    onLangChange,
    t
}) => {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden animate-in fade-in duration-200"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed md:relative z-30 h-full w-72 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 shadow-2xl md:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                            <Swords className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="font-black text-xl tracking-tight text-slate-900">{t.common.title}</h1>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.common.codexVersion}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="md:hidden text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                    <NavLink icon={Swords} label={t.nav.units} active={currentView === 'units'} onClick={() => onNav('units')} />
                    <NavLink icon={ScrollText} label={t.nav.cards} active={currentView === 'cards'} onClick={() => onNav('cards')} />
                    <NavLink icon={Map} label={t.nav.terrain} active={currentView === 'terrain'} onClick={() => onNav('terrain')} />
                    <NavLink icon={Layers} label={t.nav.scenarios} active={currentView === 'scenarios'} onClick={() => onNav('scenarios')} />
                    <div className="my-6 border-t border-slate-100"></div>
                    <NavLink icon={BookOpen} label={t.nav.rules} active={currentView === 'rules'} onClick={() => onNav('rules')} />
                </nav>

                <div className="p-6 pt-0 bg-white">
                    <LanguageSelector currentLang={lang} onLangChange={onLangChange} />
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

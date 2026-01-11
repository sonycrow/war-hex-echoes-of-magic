import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { Card as CardType } from '../types';
import { Download, Filter, Search, Grid } from 'lucide-react';

interface CardGeneratorViewProps {
    lang: 'es' | 'en';
    data: CardType[];
    t: any;
}

const CardGeneratorView: React.FC<CardGeneratorViewProps> = ({ lang, data, t }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const cardsT = t.views.cards;
    const defs = t.definitions;

    const categories = useMemo(() => {
        const set = new Set(data.map(c => c.category.en));
        return Array.from(set).sort();
    }, [data]);

    const filteredCards = useMemo(() => {
        return data.filter(c => {
            const catMatch = selectedCategory === 'all' || c.category.en === selectedCategory;
            const searchMatch = c.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.id.toLowerCase().includes(searchQuery.toLowerCase());
            return catMatch && searchMatch;
        });
    }, [data, selectedCategory, searchQuery, lang]);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Toolbar */}
            <div className="bg-white border-b border-slate-200 p-6 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{cardsT.generatorTitle || "Generador de Cartas"}</h1>
                            <p className="text-slate-500 font-medium mt-1">{cardsT.generatorDescription || "Previsualiza y genera las cartas del mazo de mando."}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[11px] tracking-wider mr-2">
                            <Filter size={14} />
                            {cardsT.category}:
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                        >
                            <option value="all">{cardsT.allCategories}</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{defs.categories[cat] || cat}</option>
                            ))}
                        </select>

                        <div className="relative ml-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-slate-200 outline-none transition-all w-64"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {filteredCards.map(card => (
                            <div key={card.id} className="flex flex-col items-center gap-4">
                                <div className="transform transition-all hover:scale-[1.03] hover:-translate-y-1">
                                    <Card card={card} lang={lang} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{card.id}</span>
                                    <button
                                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                        title="Download"
                                    >
                                        <Download size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredCards.length === 0 && (
                        <div className="h-64 flex flex-col items-center justify-center text-slate-300">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-bold">No se encontraron cartas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardGeneratorView;

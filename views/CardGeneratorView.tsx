import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import { Card as CardType } from '../types';
import { toPng } from 'html-to-image';
import { Download, Filter, Search, Grid, Image as ImageIcon, Loader2 } from 'lucide-react';

interface CardGeneratorViewProps {
    lang: 'es' | 'en';
    data: CardType[];
    t: any;
}

const CardGeneratorView: React.FC<CardGeneratorViewProps> = ({ lang, data, t }) => {
    const [selectedType, setSelectedType] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    const cardsT = t.views.cards;

    const types = useMemo(() => {
        const set = new Set(data.map(c => c.type.toLowerCase()));
        return Array.from(set).sort();
    }, [data]);

    const filteredCards = useMemo(() => {
        return data.filter(c => {
            const typeMatch = selectedType === 'all' || c.type.toLowerCase() === selectedType;
            const searchMatch = c.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.id.toLowerCase().includes(searchQuery.toLowerCase());
            return typeMatch && searchMatch;
        });
    }, [data, selectedType, searchQuery, lang]);

    const downloadCard = async (cardId: string, cardName: string) => {
        const element = document.getElementById(`card-${cardId}`);
        if (!element) return;

        setIsDownloading(cardId);
        try {
            const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `card-${cardName.toLowerCase().replace(/\s+/g, '-')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('oops, something went wrong!', err);
        } finally {
            setIsDownloading(null);
        }
    };

    const downloadAll = async () => {
        setIsDownloading('all');
        for (const card of filteredCards) {
            await downloadCard(card.id, card.name.en);
            // Small delay to prevent browser issues with many simultaneous downloads
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        setIsDownloading(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">{cardsT.generatorTitle}</h2>
                    <p className="text-slate-400 font-medium text-sm">
                        {filteredCards.length} {lang === 'es' ? 'cartas generadas en tiempo real' : 'cards generated in real-time'}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-4 shrink-0">
                    {/* Primary Action: Download All */}
                    <button
                        onClick={downloadAll}
                        disabled={isDownloading !== null || filteredCards.length === 0}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-2xl shadow-slate-950/20 uppercase tracking-[0.15em] text-[10px]"
                    >
                        {isDownloading === 'all' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Download size={18} />
                        )}
                        {t.views.stickers.downloadAll}
                    </button>

                    {/* Filters Toolbar */}
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm w-full md:w-auto">
                        <div className="flex items-center gap-2 px-3 border-r border-slate-100">
                            <Filter size={14} className="text-slate-400" />
                        </div>

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="bg-transparent text-xs font-bold text-slate-600 px-2 py-1.5 focus:outline-none cursor-pointer hover:bg-slate-50 rounded-lg transition-colors border-none ring-0 outline-none"
                        >
                            <option value="all">{cardsT.allTypes}</option>
                            {types.map(type => (
                                <option key={type} value={type}>{cardsT.cardTypes[type] || type}</option>
                            ))}
                        </select>

                        <div className="w-px h-6 bg-slate-100"></div>

                        {/* Search */}
                        <div className="relative flex items-center px-1">
                            <Search className="absolute left-3 text-slate-300" size={14} />
                            <input
                                type="text"
                                placeholder="..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 pr-3 py-1.5 bg-transparent border-none text-xs font-bold text-slate-600 focus:ring-0 outline-none w-32 md:w-48 placeholder-slate-300 transition-all hover:bg-slate-50 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Area */}
            <div className="pt-4 overflow-x-auto">
                {filteredCards.length > 0 ? (
                    <div className="flex flex-wrap gap-12 justify-center pb-12">
                        {filteredCards.map(card => (
                            <div key={card.id} className="flex flex-col items-center">
                                {/* Only this part handles the scale and restricted group */}
                                <div className="relative transform scale-75 md:scale-90 lg:scale-100 origin-top transition-transform duration-300">
                                    <div className="group relative w-[320px] h-[460px]">
                                        <Card card={card} lang={lang} t={cardsT} />

                                        {/* Overlay Download Button - Restricted EXACTLY to Card dimensions */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors pointer-events-none rounded-2xl z-20">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    downloadCard(card.id, card.name.en);
                                                }}
                                                className="pointer-events-auto bg-white text-slate-900 px-6 py-3 rounded-xl font-black shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all hover:bg-slate-50 flex items-center gap-2 border border-slate-200"
                                            >
                                                {isDownloading === card.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Download size={20} />
                                                )}
                                                {t.views.stickers.download}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Information below NOT part of the scaled group or overlay */}
                                <div className="mt-4 flex flex-col items-center">
                                    <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-1">{card.id}</span>
                                    <h3 className="font-bold text-slate-800 text-sm md:text-base text-center max-w-[280px] leading-tight">{card.name[lang]}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border-4 border-white shadow-xl shadow-slate-200/50 border-dashed">
                        <ImageIcon size={48} className="mb-4 text-slate-200" />
                        <p className="text-lg font-bold text-slate-300">{cardsT.noCardsFound}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardGeneratorView;

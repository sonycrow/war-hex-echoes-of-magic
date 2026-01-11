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

    const downloadCard = async (cardId: string, cardName: string, isBatch: boolean = false) => {
        const element = document.getElementById(`card-${cardId}`);
        if (!element) return;

        if (!isBatch) setIsDownloading(cardId);
        try {
            const options = { quality: 0.95, pixelRatio: 2, cacheBust: true };
            const dataUrl = await toPng(element, options);

            const link = document.createElement('a');
            link.download = `card-${cardName.toLowerCase().replace(/\s+/g, '-')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Download error:', err);
        } finally {
            if (!isBatch) setIsDownloading(null);
        }
    };

    const downloadAll = async () => {
        setIsDownloading('all');
        for (const card of filteredCards) {
            await downloadCard(card.id, card.name.en, true);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        setIsDownloading(null);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header / Toolbar */}
            <div className="bg-white border-b border-slate-200 p-6 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{cardsT.generatorTitle}</h1>
                            <p className="text-slate-500 font-medium mt-1">{cardsT.generatorDescription}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={downloadAll}
                                disabled={isDownloading !== null || filteredCards.length === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-slate-900/10"
                            >
                                {isDownloading === 'all' ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Download size={20} />
                                )}
                                {t.views.stickers.downloadAll} ({filteredCards.length})
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[11px] tracking-wider mr-2">
                            <Filter size={14} />
                            {cardsT.type}:
                        </div>

                        {/* Type Filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                        >
                            <option value="all">{cardsT.allTypes}</option>
                            {types.map(type => (
                                <option key={type} value={type}>{cardsT.cardTypes[type] || type}</option>
                            ))}
                        </select>

                        {/* Search */}
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

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {filteredCards.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 justify-items-center">
                            {filteredCards.map(card => (
                                <div key={card.id} className="group flex flex-col items-center">
                                    <div
                                        id={`card-container-${card.id}`}
                                        className="relative transform transition-transform duration-300 group-hover:scale-[1.02]"
                                    >
                                        <Card card={card} lang={lang} t={cardsT} />

                                        {/* Overlay Download Button */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-slate-900/10 transition-colors z-20 rounded-lg">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    downloadCard(card.id, card.name.en);
                                                }}
                                                className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all hover:bg-slate-50 flex items-center gap-2 border border-slate-200 cursor-pointer pointer-events-auto"
                                                title={t.views.stickers.download}
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

                                    <div className="mt-4 flex flex-col items-center">
                                        <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-1">{card.id}</span>
                                        <h3 className="font-bold text-slate-900 text-lg">{card.name[lang]}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center text-slate-300">
                            <ImageIcon size={64} className="mb-4 opacity-20" />
                            <p className="text-lg font-bold">{cardsT.noCardsFound}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardGeneratorView;

import React, { useState, useMemo } from 'react';
import { Unit, FactionCode } from '../types';
import Sticker from '../components/Sticker';
import { toPng } from 'html-to-image';
import { Download, Filter, Grid, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface StickersViewProps {
    lang: 'es' | 'en';
    data: Unit[];
    t: any;
}

const StickersView: React.FC<StickersViewProps> = ({ lang, data, t }) => {
    const [selectedExpansion, setSelectedExpansion] = useState<string>('all');
    const [selectedFaction, setSelectedFaction] = useState<string>('all');
    const [isDownloading, setIsDownloading] = useState<string | null>(null);

    const stickersT = t.views.stickers;
    const defs = t.definitions;

    const expansions = useMemo(() => {
        const set = new Set(data.map(u => u.expansion));
        return Array.from(set).sort();
    }, [data]);

    const factions = useMemo(() => {
        const set = new Set(data.map(u => u.faction));
        return Array.from(set).sort();
    }, [data]);

    const filteredUnits = useMemo(() => {
        return data.filter(u => {
            const expMatch = selectedExpansion === 'all' || u.expansion === selectedExpansion;
            const facMatch = selectedFaction === 'all' || u.faction === selectedFaction;
            return expMatch && facMatch;
        });
    }, [data, selectedExpansion, selectedFaction]);

    const downloadSticker = async (unitId: string, unitName: string) => {
        const element = document.getElementById(`sticker-${unitId}`);
        if (!element) return;

        setIsDownloading(unitId);
        try {
            const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `sticker-${unitName.toLowerCase().replace(/\s+/g, '-')}.png`;
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
        for (const unit of filteredUnits) {
            await downloadSticker(unit.id, unit.name.en);
            // Small delay to prevent browser issues with many simultaneous downloads
            await new Promise(resolve => setTimeout(resolve, 300));
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
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{stickersT.title}</h1>
                            <p className="text-slate-500 font-medium mt-1">{stickersT.description}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={downloadAll}
                                disabled={isDownloading !== null || filteredUnits.length === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-slate-900/10"
                            >
                                {isDownloading === 'all' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Download size={20} />
                                )}
                                {stickersT.downloadAll} ({filteredUnits.length})
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[11px] tracking-wider mr-2">
                            <Filter size={14} />
                            {defs.categories.Section}:
                        </div>

                        {/* Expansion Filter */}
                        <select
                            value={selectedExpansion}
                            onChange={(e) => setSelectedExpansion(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                        >
                            <option value="all">{stickersT.allExpansions}</option>
                            {expansions.map(exp => (
                                <option key={exp} value={exp}>{exp.charAt(0).toUpperCase() + exp.slice(1)}</option>
                            ))}
                        </select>

                        {/* Faction Filter */}
                        <select
                            value={selectedFaction}
                            onChange={(e) => setSelectedFaction(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
                        >
                            <option value="all">{stickersT.allFactions}</option>
                            {factions.map(fac => (
                                <option key={fac} value={fac}>{defs.factions[fac] || fac}</option>
                            ))}
                        </select>

                        <div className="ml-auto text-slate-400 text-sm font-medium">
                            {filteredUnits.length} {stickersT.title.toLowerCase()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {filteredUnits.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-12 justify-items-center">
                            {filteredUnits.map(unit => (
                                <div key={unit.id} className="group flex flex-col items-center">
                                    <div className="relative transform transition-transform duration-300 group-hover:scale-[1.02]">
                                        <Sticker unit={unit} lang={lang} />

                                        {/* Overlay Download Button */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors pointer-events-none rounded-lg">
                                            <button
                                                onClick={() => downloadSticker(unit.id, unit.name.en)}
                                                className="pointer-events-auto bg-white text-slate-900 px-6 py-3 rounded-xl font-black shadow-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all hover:bg-slate-50 flex items-center gap-2 border border-slate-200"
                                            >
                                                {isDownloading === unit.id ? (
                                                    <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                                                ) : (
                                                    <Download size={20} />
                                                )}
                                                {stickersT.download}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col items-center">
                                        <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-1">{unit.id}</span>
                                        <h3 className="font-bold text-slate-900 text-lg">{unit.name[lang]}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-96 flex flex-col items-center justify-center text-slate-300">
                            <ImageIcon size={64} className="mb-4 opacity-20" />
                            <p className="text-lg font-bold">No se encontraron unidades</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StickersView;

import React, { useState, useMemo } from 'react';
import { Unit, FactionCode } from '../types';
import Sticker from '../components/Sticker';
import { toPng } from 'html-to-image';
import { Download, Filter, Grid, Image as ImageIcon, CheckCircle2, Search } from 'lucide-react';

interface StickersViewProps {
    lang: 'es' | 'en';
    data: Unit[];
    t: any;
}

const StickersView: React.FC<StickersViewProps> = ({ lang, data, t }) => {
    const [selectedExpansion, setSelectedExpansion] = useState<string>('all');
    const [selectedFaction, setSelectedFaction] = useState<string>('all');
    const [rotationType, setRotationType] = useState<'cw' | 'ccw'>('cw');
    const [showName, setShowName] = useState<boolean>(true);
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">{stickersT.title}</h2>
                    <p className="text-slate-400 font-medium text-sm">
                        {filteredUnits.length} {lang === 'es' ? 'stickers listos para impresión' : 'stickers ready for printing'}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-4 shrink-0">
                    {/* Primary Action: Download All */}
                    <button
                        onClick={downloadAll}
                        disabled={isDownloading !== null || filteredUnits.length === 0}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-2xl shadow-slate-950/20 uppercase tracking-[0.15em] text-[10px]"
                    >
                        {isDownloading === 'all' ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Download size={18} />
                        )}
                        {stickersT.downloadAll}
                    </button>

                    {/* Filters Container */}
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 px-3 border-r border-slate-100">
                            <Filter size={14} className="text-slate-400" />
                        </div>

                        <select
                            value={selectedExpansion}
                            onChange={(e) => setSelectedExpansion(e.target.value)}
                            className="bg-transparent text-xs font-bold text-slate-600 px-2 py-1.5 focus:outline-none cursor-pointer hover:bg-slate-50 rounded-lg transition-colors border-none ring-0 outline-none"
                        >
                            <option value="all">{stickersT.allExpansions}</option>
                            {expansions.map(exp => (
                                <option key={exp} value={exp}>{exp.charAt(0).toUpperCase() + exp.slice(1)}</option>
                            ))}
                        </select>

                        <div className="w-px h-6 bg-slate-100"></div>

                        <select
                            value={selectedFaction}
                            onChange={(e) => setSelectedFaction(e.target.value)}
                            className="bg-transparent text-xs font-bold text-slate-600 px-2 py-1.5 focus:outline-none cursor-pointer hover:bg-slate-50 rounded-lg transition-colors border-none ring-0 outline-none"
                        >
                            <option value="all">{stickersT.allFactions}</option>
                            {factions.map(fac => (
                                <option key={fac} value={fac}>{defs.factions[fac] || fac}</option>
                            ))}
                        </select>

                        <div className="w-px h-6 bg-slate-100"></div>

                        <button
                            onClick={() => setRotationType(rotationType === 'cw' ? 'ccw' : 'cw')}
                            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-600 group"
                        >
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">Giro:</span>
                            <span className="text-xs font-bold">{rotationType.toUpperCase()}</span>
                        </button>

                        <div className="w-px h-6 bg-slate-100"></div>

                        <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={showName}
                                onChange={(e) => setShowName(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
                            />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">Nombre</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Grid Area with horizontal scroll safety for mobile */}
            <div className="pt-4 overflow-x-auto">
                {filteredUnits.length > 0 ? (
                    <div className="flex flex-wrap gap-16 justify-center pb-12">
                        {filteredUnits.map(unit => (
                            <div key={unit.id} className="flex flex-col items-center">
                                <div className="relative group transform scale-75 md:scale-90 lg:scale-100 origin-top transition-transform duration-300 h-[600px] md:h-[650px] lg:h-[700px]">
                                    {/* The Sticker component contains the rotate controls and the 512px div */}
                                    <Sticker unit={unit} lang={lang} rotationType={rotationType} showName={showName} />

                                    {/* Overlay Download Button */}
                                    <div className="absolute inset-0 top-[70px] flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors pointer-events-none rounded-lg h-[512px]">
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

                                    {/* Unit Info attached to scaled container */}
                                    <div className="mt-8 flex flex-col items-center">
                                        <span className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-1">{unit.id}</span>
                                        <h3 className="font-bold text-slate-800 text-base md:text-xl text-center max-w-[300px] leading-tight">{unit.name[lang]}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-96 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm border-dashed">
                        <ImageIcon size={48} className="mb-4 text-slate-200" />
                        <p className="text-lg font-bold text-slate-300">{lang === 'es' ? 'No se encontraron unidades' : 'No units found'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StickersView;

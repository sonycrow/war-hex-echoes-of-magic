import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
    ZoomIn, ZoomOut, Share2, Copy, Check, Trash2,
    Maximize2, Minimize2, Move, Download, MousePointer2,
    Map as MapIcon, PlusCircle, Flag, Info, Trash, Swords
} from 'lucide-react';
import { Terrain, Unit } from '../types';

interface MapHex {
    t: string; // terrainId
    u?: string; // unitId
    f?: string; // faction (optional override)
    o?: string; // overlayId (medal, poi, etc.)
}

interface MapEditorViewProps {
    lang: 'es' | 'en';
    data: {
        terrain: Terrain[];
        units: Unit[];
    };
    t: any;
}

const HEX_WIDTH = 80;
const HEX_HEIGHT = 92;
const VERTICAL_STEP = 69; // 92 * 0.75
const HORIZONTAL_STEP = 80;

const TERRAIN_MAP: Record<string, string> = {
    't1': 'a', 't2': 'b', 't3': 'c', 't4': 'd', 't5': 'e', 't6': 'f', 't7': 'g'
};
const REVERSE_TERRAIN_MAP: Record<string, string> = Object.fromEntries(
    Object.entries(TERRAIN_MAP).map(([k, v]) => [v, k])
);

const MapEditorView: React.FC<MapEditorViewProps> = ({ lang, data, t }) => {
    const viewsT = t.views.mapEditor;
    const [mapSize, setMapSize] = useState<'standard' | 'epic'>('standard');
    const [zoom, setZoom] = useState(1);
    const [selectedTool, setSelectedTool] = useState<{ type: 'terrain' | 'unit' | 'overlay' | 'eraser', id: string }>({ type: 'terrain', id: 't1' });
    const [isPainting, setIsPainting] = useState(false);
    const [showPermalinkFeedback, setShowPermalinkFeedback] = useState(false);
    const [grid, setGrid] = useState<MapHex[]>([]);

    const cols = mapSize === 'standard' ? 13 : 26;
    const rows = 9;

    // Initialize grid
    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.split('?')[1]);
        const mapData = params.get('m');

        if (mapData) {
            try {
                const [size, terrainEncoded] = mapData.split('|');
                setMapSize(size === 'e' ? 'epic' : 'standard');
                const newCols = size === 'e' ? 26 : 13;
                const newGrid: MapHex[] = [];
                for (let i = 0; i < terrainEncoded.length; i++) {
                    newGrid.push({ t: REVERSE_TERRAIN_MAP[terrainEncoded[i]] || 't1' });
                }
                // Fill if shorter
                while (newGrid.length < newCols * 9) newGrid.push({ t: 't1' });
                setGrid(newGrid);
                return;
            } catch (e) {
                console.error("Failed to parse map permalink", e);
            }
        }

        // Default grid
        setGrid(Array(cols * rows).fill(null).map(() => ({ t: 't1' })));
    }, []); // Run once on mount

    // Update grid when size changes (only if not loading from URL)
    const handleSizeChange = (size: 'standard' | 'epic') => {
        setMapSize(size);
        const newCols = size === 'standard' ? 13 : 26;
        setGrid(prev => {
            const newGrid = Array(newCols * rows).fill(null).map(() => ({ t: 't1' }));
            // Copy existing as much as possible? 
            // Better to just reset or keep what fits.
            return newGrid;
        });
    };

    const handleHexAction = useCallback((index: number) => {
        setGrid(prev => {
            const newGrid = [...prev];
            if (selectedTool.type === 'terrain') {
                newGrid[index] = { ...newGrid[index], t: selectedTool.id };
            } else if (selectedTool.type === 'unit') {
                newGrid[index] = { ...newGrid[index], u: selectedTool.id };
            } else if (selectedTool.type === 'eraser') {
                newGrid[index] = { t: 't1' };
            }
            return newGrid;
        });
    }, [selectedTool]);

    const generatePermalink = () => {
        const terrainEncoded = grid.map(hex => TERRAIN_MAP[hex.t] || 'a').join('');
        const sizeCode = mapSize === 'epic' ? 'e' : 's';
        const mapValue = `${sizeCode}|${terrainEncoded}`;

        const url = new URL(window.location.href);
        url.hash = `${window.location.hash.split('?')[0]}?m=${mapValue}`;

        navigator.clipboard.writeText(url.toString());
        setShowPermalinkFeedback(true);
        setTimeout(() => setShowPermalinkFeedback(false), 2000);
    };

    const hexStyles = (col: number, row: number) => {
        const x = col * HORIZONTAL_STEP + (row % 2 === 1 ? HORIZONTAL_STEP / 2 : 0);
        const y = row * VERTICAL_STEP;
        return {
            left: `${x}px`,
            top: `${y}px`,
            width: `${HEX_WIDTH}px`,
            height: `${HEX_HEIGHT}px`,
        };
    };

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Header & Main Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                        <MapIcon className="text-slate-400" />
                        {viewsT.title}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">{viewsT.size}: {mapSize === 'standard' ? viewsT.standard : viewsT.epic}</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    <button
                        onClick={() => {
                            if (window.confirm("¿Vaciar el mapa?")) {
                                setGrid(Array(cols * rows).fill(null).map(() => ({ t: 't1' })));
                            }
                        }}
                        className="p-2 mr-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Reset Map"
                    >
                        <Trash size={18} />
                    </button>
                    <div className="w-px h-6 bg-slate-100 mr-2"></div>
                    <button
                        onClick={() => handleSizeChange('standard')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mapSize === 'standard' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        {viewsT.standard}
                    </button>
                    <button
                        onClick={() => handleSizeChange('epic')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mapSize === 'epic' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        {viewsT.epic}
                    </button>
                    <div className="w-px h-6 bg-slate-100 mx-2"></div>
                    <button
                        onClick={generatePermalink}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-amber-600 hover:bg-amber-50 transition-all active:scale-95"
                    >
                        {showPermalinkFeedback ? <Check size={14} /> : <Share2 size={14} />}
                        {showPermalinkFeedback ? viewsT.copied : viewsT.permalink}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 lg:flex-row gap-6">
                {/* Toolbox */}
                <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-full overflow-y-auto pr-2 custom-scrollbar">
                    {/* Terrains */}
                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{viewsT.terrain}</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {data.terrain.map(terrain => (
                                <button
                                    key={terrain.id}
                                    onClick={() => setSelectedTool({ type: 'terrain', id: terrain.id })}
                                    className={`relative aspect-square rounded-xl transition-all border-2 overflow-hidden ${selectedTool.id === terrain.id ? 'border-amber-500 shadow-md ring-2 ring-amber-500/20' : 'border-transparent hover:border-slate-200'}`}
                                    title={terrain.name[lang]}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center p-1">
                                        <img
                                            src={`/assets/game/terrain/${terrain.id}.png`}
                                            className="w-full h-full object-contain hex-clip scale-110"
                                            alt={terrain.name[lang]}
                                        />
                                    </div>
                                    {selectedTool.id === terrain.id && (
                                        <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-sm">
                                            <Check size={10} />
                                        </div>
                                    )}
                                </button>
                            ))}
                            <button
                                onClick={() => setSelectedTool({ type: 'eraser', id: 'erase' })}
                                className={`aspect-square rounded-xl transition-all border-2 flex items-center justify-center ${selectedTool.type === 'eraser' ? 'border-red-500 bg-red-50 text-red-500 shadow-md ring-2 ring-red-500/20' : 'border-transparent bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                                title="Eraser"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </section>

                    {/* Units (Placeholder grouped by faction) */}
                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex-1 overflow-hidden flex flex-col">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{viewsT.overlay}</h3>
                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 opacity-50 cursor-not-allowed">
                                    <Swords size={20} />
                                    <span className="text-[10px] font-bold uppercase">Unidad</span>
                                </button>
                                <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 opacity-50 cursor-not-allowed">
                                    <Flag size={20} />
                                    <span className="text-[10px] font-bold uppercase">Medalla</span>
                                </button>
                                <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 opacity-50 cursor-not-allowed">
                                    <Info size={20} />
                                    <span className="text-[10px] font-bold uppercase">P.O.I.</span>
                                </button>
                                <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 opacity-50 cursor-not-allowed">
                                    <PlusCircle size={20} />
                                    <span className="text-[10px] font-bold uppercase">Más</span>
                                </button>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <p className="text-[10px] text-amber-700 font-medium leading-relaxed italic">
                                    "Los elementos tácticos permiten definir las condiciones de victoria y despliegue inicial."
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Zoom Control */}
                    <div className="bg-slate-900 rounded-3xl p-4 flex items-center justify-between shadow-xl">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{viewsT.zoom}: {Math.round(zoom * 100)}%</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                                className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
                            >
                                <ZoomOut size={16} />
                            </button>
                            <button
                                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                                className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
                            >
                                <ZoomIn size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map Viewport */}
                <div className="flex-1 bg-slate-200/50 rounded-[2.5rem] border-4 border-white shadow-inner overflow-hidden relative group cursor-crosshair select-none">
                    <div
                        className="w-full h-full overflow-auto p-20 custom-scrollbar"
                    >
                        <div
                            className="relative shadow-2xl transition-transform duration-200 ease-out origin-center"
                            style={{
                                width: `${cols * HORIZONTAL_STEP + (HORIZONTAL_STEP / 2)}px`,
                                height: `${rows * VERTICAL_STEP + (HEX_HEIGHT * 0.25)}px`,
                                transform: `scale(${zoom})`,
                                margin: '0 auto'
                            }}
                            onMouseDown={() => setIsPainting(true)}
                            onMouseUp={() => setIsPainting(false)}
                            onMouseLeave={() => setIsPainting(false)}
                        >
                            {/* Grid Content */}
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] hex-clip border-8 border-white/20"></div>

                            {/* The Hexes */}
                            {grid.map((hex, i) => {
                                const col = i % cols;
                                const row = Math.floor(i / cols);
                                return (
                                    <div
                                        key={i}
                                        className="absolute hex-clip transition-all duration-300"
                                        style={{
                                            ...hexStyles(col, row),
                                            backgroundColor: hex.t === 't1' ? '#f8fafc' : 'transparent',
                                            zIndex: 5
                                        }}
                                        onMouseEnter={() => isPainting && handleHexAction(i)}
                                        onMouseDown={() => handleHexAction(i)}
                                    >
                                        <img
                                            src={`/assets/game/terrain/${hex.t}.png`}
                                            className="w-full h-full object-cover scale-110"
                                            alt=""
                                            draggable={false}
                                        />

                                        {/* Overlay Grid lines */}
                                        <div className="absolute inset-0 border-[0.5px] border-black/5 hover:bg-white/10 transition-colors pointer-events-none"></div>
                                    </div>
                                );
                            })}

                            {/* Section Dividers */}
                            {/* 13 columns: sections after col 3 (4-5-4) */}
                            {/* 26 columns: double it? (8-10-8)? */}
                            {(() => {
                                const leftSectionEnd = mapSize === 'standard' ? 4 : 8;
                                const rightSectionStart = mapSize === 'standard' ? 9 : 18;

                                const leftX = leftSectionEnd * HORIZONTAL_STEP - 5;
                                const rightX = rightSectionStart * HORIZONTAL_STEP - 5;

                                return (
                                    <>
                                        <div
                                            className="absolute top-0 bottom-0 border-l-4 border-red-500/50 z-20 pointer-events-none"
                                            style={{ left: `${leftX}px` }}
                                        >
                                            <div className="bg-red-500/50 text-white text-[8px] font-black px-2 py-0.5 rounded-br-lg uppercase">Section</div>
                                        </div>
                                        <div
                                            className="absolute top-0 bottom-0 border-l-4 border-red-500/50 z-20 pointer-events-none"
                                            style={{ left: `${rightX}px` }}
                                        >
                                            <div className="bg-red-500/50 text-white text-[8px] font-black px-2 py-0.5 rounded-br-lg uppercase">Section</div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Zoom / Pan indicator */}
                    <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-lg text-[10px] font-black text-slate-400 uppercase tracking-widest hidden group-hover:block transition-all animate-in fade-in slide-in-from-bottom-2">
                        Click & Drag to Paint • Use Zoom Controls
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapEditorView;

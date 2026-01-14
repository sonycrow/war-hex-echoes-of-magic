import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
    ZoomIn, ZoomOut, Share2, Copy, Check, Trash2,
    Maximize2, Minimize2, Move, Download, MousePointer2,
    Map as MapIcon, PlusCircle, Flag, Info, Trash, Swords, Search
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

const MAP_SIZES = {
    'standard': { cols: 13, rows: 9, label_es: 'Estándar (13x9)', label_en: 'Standard (13x9)', code: 's' },
    'epic': { cols: 26, rows: 9, label_es: 'Épico (26x9)', label_en: 'Epic (26x9)', code: 'e' },
    'skirmish': { cols: 9, rows: 7, label_es: 'Escaramuza (9x7)', label_en: 'Skirmish (9x7)', code: 'k' },
    'large': { cols: 15, rows: 11, label_es: 'Grande (15x11)', label_en: 'Large (15x11)', code: 'l' },
};

const MapEditorView: React.FC<MapEditorViewProps> = ({ lang, data, t }) => {
    const viewsT = t.views.mapEditor;
    const [mapSize, setMapSize] = useState<keyof typeof MAP_SIZES>('standard');
    const [zoom, setZoom] = useState(1);
    const [selectedTool, setSelectedTool] = useState<{ type: 'terrain' | 'unit' | 'overlay' | 'eraser', id: string }>({ type: 'terrain', id: 't1' });
    const [isPainting, setIsPainting] = useState(false);
    const [isDraggingMap, setIsDraggingMap] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [showPermalinkFeedback, setShowPermalinkFeedback] = useState(false);
    const [grid, setGrid] = useState<MapHex[]>([]);

    const viewportRef = useRef<HTMLDivElement>(null);

    const { cols, rows } = MAP_SIZES[mapSize];

    // Initialize grid
    useEffect(() => {
        const hash = window.location.hash.split('?')[1];
        if (!hash) {
            setGrid(Array(cols * rows).fill(null).map(() => ({ t: 't1' })));
            return;
        }

        const params = new URLSearchParams(hash);
        const mapData = params.get('m');

        if (mapData) {
            try {
                const [sizeCode, terrainEncoded] = mapData.split('|');
                const matchedSize = Object.entries(MAP_SIZES).find(([_, info]) => info.code === sizeCode)?.[0] as keyof typeof MAP_SIZES;
                const finalSize = matchedSize || 'standard';

                setMapSize(finalSize);
                const newCols = MAP_SIZES[finalSize].cols;
                const newRows = MAP_SIZES[finalSize].rows;

                const newGrid: MapHex[] = [];
                for (let i = 0; i < terrainEncoded.length; i++) {
                    newGrid.push({ t: REVERSE_TERRAIN_MAP[terrainEncoded[i]] || 't1' });
                }
                // Fill if shorter
                while (newGrid.length < newCols * newRows) newGrid.push({ t: 't1' });
                setGrid(newGrid);
                return;
            } catch (e) {
                console.error("Failed to parse map permalink", e);
            }
        }

        setGrid(Array(cols * rows).fill(null).map(() => ({ t: 't1' })));
    }, []); // Run once on mount

    const handleSizeChange = (size: keyof typeof MAP_SIZES) => {
        if (window.confirm(lang === 'es' ? "¿Cambiar el tamaño del mapa reseteará el diseño actual, continuar?" : "Changing map size will reset current design, continue?")) {
            setMapSize(size);
            const { cols: newCols, rows: newRows } = MAP_SIZES[size];
            setGrid(Array(newCols * newRows).fill(null).map(() => ({ t: 't1' })));
        }
    };

    const handleHexAction = useCallback((index: number) => {
        if (isDraggingMap) return;
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
    }, [selectedTool, isDraggingMap]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 2) {
            setIsDraggingMap(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
        } else if (e.button === 0) {
            setIsPainting(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDraggingMap && viewportRef.current) {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            viewportRef.current.scrollLeft -= dx;
            viewportRef.current.scrollTop -= dy;
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDraggingMap(false);
        setIsPainting(false);
    };

    const generatePermalink = () => {
        const terrainEncoded = grid.map(hex => TERRAIN_MAP[hex.t] || 'a').join('');
        const sizeCode = MAP_SIZES[mapSize].code;
        const mapValue = `${sizeCode}|${terrainEncoded}`;

        const url = new URL(window.location.href);
        url.hash = `map-editor?m=${mapValue}`;

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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header matching DataTable */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">{viewsT.title}</h2>
                    <p className="text-slate-400 font-medium text-sm">
                        {lang === 'es' ? `Configurando mapa de ${cols}x${rows} hexágonos` : `Configuring ${cols}x${rows} hex map`}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-100 shadow-sm">
                        <select
                            value={mapSize}
                            onChange={(e) => handleSizeChange(e.target.value as keyof typeof MAP_SIZES)}
                            className="bg-transparent text-sm font-bold text-slate-600 px-3 py-1.5 focus:outline-none cursor-pointer"
                        >
                            {Object.entries(MAP_SIZES).map(([key, info]) => (
                                <option key={key} value={key}>
                                    {lang === 'es' ? info.label_es : info.label_en}
                                </option>
                            ))}
                        </select>
                        <div className="w-px h-6 bg-slate-100 mx-1"></div>
                        <button
                            onClick={generatePermalink}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black text-amber-600 hover:bg-amber-50 transition-all active:scale-95 uppercase tracking-wider"
                        >
                            {showPermalinkFeedback ? <Check size={14} /> : <Share2 size={14} />}
                            {showPermalinkFeedback ? viewsT.copied : viewsT.permalink}
                        </button>
                        <div className="w-px h-6 bg-slate-100 mx-1"></div>
                        <button
                            onClick={() => {
                                if (window.confirm(lang === 'es' ? "¿Vaciar el mapa?" : "Clear map?")) {
                                    setGrid(Array(cols * rows).fill(null).map(() => ({ t: 't1' })));
                                }
                            }}
                            className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reset Map"
                        >
                            <Trash size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col min-h-[600px] lg:flex-row gap-6">
                {/* Toolbox */}
                <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 pr-2">
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

                    {/* Units/Overlay */}
                    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex-1 flex flex-col min-h-[300px]">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{viewsT.overlay}</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 opacity-50 cursor-not-allowed group-hover:bg-white transition-colors">
                                    <Swords size={20} />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Unidad</span>
                                </button>
                                <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 opacity-50 cursor-not-allowed">
                                    <Flag size={20} />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Medalla</span>
                                </button>
                                <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 opacity-50 cursor-not-allowed">
                                    <Info size={20} />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">P.O.I.</span>
                                </button>
                                <button className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 opacity-50 cursor-not-allowed">
                                    <PlusCircle size={20} />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Más</span>
                                </button>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <p className="text-[10px] text-amber-700 font-medium leading-relaxed italic">
                                    "Los elementos tácticos permiten definir las condiciones de victoria y despliegue inicial."
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Map Viewport Area */}
                <div className="flex-1 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden relative group select-none min-h-[600px]">
                    {/* Floating Zoom Controls */}
                    <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
                        <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-1.5 flex flex-col shadow-2xl border border-white/10">
                            <button
                                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                                className="w-10 h-10 rounded-xl text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <ZoomIn size={20} />
                            </button>
                            <div className="h-px bg-white/10 mx-2 my-1"></div>
                            <button
                                onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                                className="w-10 h-10 rounded-xl text-white flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <ZoomOut size={20} />
                            </button>
                        </div>
                        <div className="bg-slate-900/90 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-xl border border-white/10 flex justify-center">
                            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
                        </div>
                    </div>

                    <div
                        ref={viewportRef}
                        className="w-full h-full overflow-auto p-20 custom-scrollbar cursor-crosshair"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onContextMenu={(e) => e.preventDefault()}
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
                            {/* Grid Content Background */}
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
                            {(() => {
                                const leftSectionEnd = Math.floor(cols / 3);
                                const rightSectionStart = Math.floor(cols * 2 / 3);

                                const leftX = leftSectionEnd * HORIZONTAL_STEP - 5;
                                const rightX = rightSectionStart * HORIZONTAL_STEP - 5;

                                return (
                                    <>
                                        <div
                                            className="absolute top-0 bottom-0 border-l-4 border-red-500/50 z-20 pointer-events-none"
                                            style={{ left: `${leftX}px` }}
                                        >
                                            <div className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-br-lg uppercase">Section</div>
                                        </div>
                                        <div
                                            className="absolute top-0 bottom-0 border-l-4 border-red-500/50 z-20 pointer-events-none"
                                            style={{ left: `${rightX}px` }}
                                        >
                                            <div className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-br-lg uppercase">Section</div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Zoom / Pan indicator */}
                    <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white shadow-lg text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] hidden group-hover:block transition-all animate-in fade-in slide-in-from-bottom-2 z-30">
                        <span className="text-amber-600">Click Izq:</span> Pintar • <span className="text-amber-600">Click Der:</span> Mover Mapa
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapEditorView;

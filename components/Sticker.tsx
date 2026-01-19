import React, { useState } from 'react';
import { Unit, FactionCode } from '../types';
import { RotateCw, RotateCcw } from 'lucide-react';

interface StickerProps {
    unit: Unit;
    lang: 'es' | 'en';
    rotationType?: 'cw' | 'ccw';
    showName?: boolean;
}

const factionColors: Record<FactionCode, { bg: string; text: string; accent: string; border: string }> = {
    amazons: { bg: '#FFFED4', text: '#D3CD3A', accent: '#D3CD3A', border: '#D3CD3A' },
    barbarians: { bg: '#F0F9FF', text: '#2C7CB6', accent: '#2C7CB6', border: '#2C7CB6' },
    daemons: { bg: '#FEF2F2', text: '#BD2E2E', accent: '#BD2E2E', border: '#BD2E2E' },
    dwarves: { bg: '#FAF5FF', text: '#9141BB', accent: '#9141BB', border: '#9141BB' },
    elves: { bg: '#F0FDF4', text: '#439D41', accent: '#439D41', border: '#439D41' },
    orcs: { bg: '#FFFBEB', text: '#D0691C', accent: '#D0691C', border: '#D0691C' },
    undead: { bg: '#F8FAFC', text: '#202020ff', accent: '#3A3A3A', border: '#3A3A3A' },
    mercenaries: { bg: '#FEFCE8', text: '#593A02', accent: '#593A02', border: '#593A02' },
    titans: { bg: '#FFFFFF', text: '#a3a3a3ff', accent: '#EFEFEF', border: '#EFEFEF' },
    inferno: { bg: '#FEF2F2', text: '#750808', accent: '#750808', border: '#750808' },
    neutral: { bg: '#F9FAFB', text: '#374151', accent: '#6B7280', border: '#D1D5DB' },
};

const Sticker: React.FC<StickerProps> = ({ unit, lang, rotationType = 'cw', showName = true }) => {
    const [rotation, setRotation] = useState(0);
    const colors = factionColors[unit.faction] || factionColors.neutral;

    const rotateLeft = () => setRotation((prev) => (prev - 90 + 360) % 360);
    const rotateRight = () => setRotation((prev) => (prev + 90) % 360);

    const renderDiamonds = (count: number, vertical: boolean = false) => {
        if (count <= 0) return null;
        return (
            <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} gap-4 items-center justify-center`}>
                {Array.from({ length: count }).map((_, i) => (
                    <div
                        key={i}
                        className="w-10 h-10 rotate-45 bg-white border-2 border-black/10 shadow-sm"
                    />
                ))}
            </div>
        );
    };

    // Calculate values based on rotation type
    // CW: Top(S), Left(S-1), Bottom(S-2), Right(S-3)
    // CCW: Top(S), Right(S-1), Bottom(S-2), Left(S-3)
    const topVal = unit.strength;
    const bottomVal = unit.strength - 2;
    const rightVal = rotationType === 'cw' ? unit.strength - 3 : unit.strength - 1;
    const leftVal = rotationType === 'cw' ? unit.strength - 1 : unit.strength - 3;

    const imageUrl = `/assets/art/units/${unit.expansion}/${unit.id}.png`;

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Rotation Controls */}
            <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
                <button
                    onClick={rotateLeft}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
                    title="Rotar Izquierda"
                >
                    <RotateCcw size={20} />
                </button>
                <button
                    onClick={rotateRight}
                    className="p-2 hover:bg-slate-100 rounded-md transition-colors text-slate-600"
                    title="Rotar Derecha"
                >
                    <RotateCw size={20} />
                </button>
                <div className="flex items-center px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-l ml-1">
                    {rotation}° | {rotationType.toUpperCase()}
                </div>
            </div>

            {/* Sticker Container */}
            <div
                id={`sticker-${unit.id}`}
                className="relative w-[512px] h-[512px] shadow-2xl overflow-hidden select-none transition-transform duration-500 ease-in-out"
                style={{
                    backgroundColor: colors.text,
                    fontFamily: "'Outfit', 'Inter', sans-serif",
                    transform: `rotate(${rotation}deg)`
                }}
            >
                {/* 1. LAYER: Central Container (Image & Name) */}
                <div
                    className="absolute inset-[66px] border-4 shadow-2xl rounded-sm z-10 flex flex-col items-center justify-center overflow-hidden"
                    style={{
                        backgroundColor: colors.bg,
                        borderColor: colors.text,
                        boxShadow: `inset 0 0 68px ${colors.text}22`
                    }}
                >
                    {/* Unit Image */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <img
                            src={imageUrl}
                            alt={unit.name.en}
                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)]"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
                            }}
                        />
                    </div>

                    {/* Unit Name (Overlaid on bottom) */}
                    {showName && (
                        <div className="absolute bottom-4 left-0 right-0 px-4 flex items-center justify-center pointer-events-none">
                            <h2
                                className="text-5xl font-normal uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] text-center"
                                style={{
                                    color: colors.text,
                                    fontFamily: "'Germania One', system-ui"
                                }}
                            >
                                {unit.name[lang]}
                            </h2>
                        </div>
                    )}
                </div>

                {/* 3. LAYER: UI Elements (Topmost) */}

                {/* Top Edge */}
                <div className="absolute top-4 left-0 right-0 flex justify-center z-20">
                    {renderDiamonds(topVal)}
                </div>

                {/* Right Edge */}
                <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-center z-20">
                    {renderDiamonds(rightVal, true)}
                </div>

                {/* Bottom Edge */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
                    {renderDiamonds(bottomVal)}
                </div>

                {/* Left Edge */}
                <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-center z-20">
                    {renderDiamonds(leftVal, true)}
                </div>

                {/* Cost - Top Left Gold Coin */}
                <div className="absolute top-6 left-6 z-30">
                    <div
                        className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-4 border-amber-800/40 shadow-2xl text-amber-950 font-normal text-7xl relative select-none"
                        style={{ fontFamily: "'Germania One', system-ui" }}
                    >
                        <div className="absolute inset-1 rounded-full border-2 border-white/40 pointer-events-none"></div>
                        <span className="drop-shadow-lg z-10">{unit.cost}</span>
                        <div className="absolute top-2 left-6 w-8 h-4 bg-white/30 rounded-full rotate-[-45deg]"></div>
                    </div>
                </div>

                {/* Unit Type - Top Right */}
                <div className="absolute top-8 right-8 z-30 pointer-events-none">
                    <div className="flex items-center justify-center">
                        {unit.type === 'light' && (
                            <div className="w-16 h-16 rounded-full bg-[#4ADE80] border-4 border-white shadow-[0_4px_10px_rgba(0,0,0,0.3)]" />
                        )}
                        {unit.type === 'medium' && (
                            <div
                                className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-t-[56px] border-t-[#38BDF8] filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)]"
                                style={{ filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.3)) drop-shadow(0 0 2px white)' }}
                            />
                        )}
                        {unit.type === 'heavy' && (
                            <div className="w-16 h-16 bg-[#EF4444] border-4 border-white shadow-[0_4px_10px_rgba(0,0,0,0.3)]" />
                        )}
                        {unit.type === 'elite' && (
                            <div className="text-[100px] font-black text-[#A855F7] leading-none select-none filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]" style={{ WebkitTextStroke: '3px white' }}>
                                ★
                            </div>
                        )}
                    </div>
                </div>

                {/* Movement - Bottom Left */}
                <div className="absolute bottom-6 left-6 z-30">
                    <div
                        className="flex flex-col items-center justify-center w-20 h-20 bg-white border-4 border-black/20 rounded-xl shadow-lg"
                        style={{ fontFamily: "'Germania One', system-ui" }}
                    >
                        <span className="text-7xl font-normal text-slate-900 leading-none">{unit.movement}</span>
                    </div>
                </div>

                {/* Range - Bottom Right */}
                <div className="absolute bottom-6 right-6 z-30">
                    <div
                        className="flex flex-col items-center justify-center w-20 h-20 bg-white border-4 border-black/20 rounded-xl shadow-lg"
                        style={{ fontFamily: "'Germania One', system-ui" }}
                    >
                        <span className="text-7xl font-normal text-slate-900 leading-none">{unit.range}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sticker;

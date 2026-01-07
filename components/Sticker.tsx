import React from 'react';
import { Unit, FactionCode } from '../types';

interface StickerProps {
    unit: Unit;
    lang: 'es' | 'en';
}

const factionColors: Record<FactionCode, { bg: string; text: string; accent: string; border: string }> = {
    amazons: { bg: '#FFF7ED', text: '#9A3412', accent: '#EA580C', border: '#FB923C' },
    barbarians: { bg: '#FEF2F2', text: '#991B1B', accent: '#DC2626', border: '#F87171' },
    daemons: { bg: '#FAF5FF', text: '#6B21A8', accent: '#9333EA', border: '#C084FC' },
    dwarves: { bg: '#EEF2FF', text: '#3730A3', accent: '#4F46E5', border: '#818CF8' },
    elves: { bg: '#F0FDF4', text: '#166534', accent: '#16A34A', border: '#4ADE80' },
    orcs: { bg: '#FFFBEB', text: '#92400E', accent: '#D97706', border: '#FBBF24' },
    undead: { bg: '#F8FAFC', text: '#1E293B', accent: '#475569', border: '#94A3B8' },
    mercenaries: { bg: '#EFF6FF', text: '#1E40AF', accent: '#2563EB', border: '#60A5FA' },
    titans: { bg: '#FFFBEB', text: '#78350F', accent: '#B45309', border: '#F59E0B' },
    inferno: { bg: '#FFF1F2', text: '#9F1239', accent: '#E11D48', border: '#FB7185' },
    neutral: { bg: '#F9FAFB', text: '#374151', accent: '#6B7280', border: '#D1D5DB' },
};

const Sticker: React.FC<StickerProps> = ({ unit, lang }) => {
    const colors = factionColors[unit.faction] || factionColors.neutral;

    const nameEn = unit.name.en.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

    const imageUrl = `/assets/art/units/${unit.expansion}/${unit.expansion}_${unit.faction}_${nameEn}.png`;

    return (
        <div
            id={`sticker-${unit.id}`}
            className="relative w-[512px] h-[512px] shadow-2xl overflow-hidden select-none"
            style={{
                backgroundColor: colors.bg,
                border: `12px solid ${colors.text}`,
                fontFamily: "'Outfit', 'Inter', sans-serif"
            }}
        >
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            {/* Corner Markers (Columbia Games style) */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 opacity-20" style={{ borderColor: colors.text }} />
            <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 opacity-20" style={{ borderColor: colors.text }} />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 opacity-20" style={{ borderColor: colors.text }} />
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 opacity-20" style={{ borderColor: colors.text }} />

            {/* Header: Name */}
            <div className="absolute top-8 left-0 right-0 text-center px-10">
                <h2
                    className="text-4xl font-black uppercase tracking-tighter drop-shadow-sm"
                    style={{ color: colors.text }}
                >
                    {unit.name[lang]}
                </h2>
                <div
                    className="h-1.5 w-24 mx-auto mt-2 rounded-full"
                    style={{ backgroundColor: colors.accent }}
                />
            </div>

            {/* Center: Unit Image */}
            <div className="absolute inset-0 flex items-center justify-center p-20 mt-4">
                <img
                    src={imageUrl}
                    alt={unit.name.en}
                    className="max-w-full max-h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image';
                    }}
                />
            </div>

            {/* Stats - Columbia Games Inspired Layout */}

            {/* Strength - Top Left */}
            <div className="absolute top-6 left-6 w-20 h-20 flex flex-col items-center justify-center">
                <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-lg rotate-[-5deg]"
                    style={{ backgroundColor: colors.text }}
                >
                    {unit.strength}
                </div>
                <span className="text-[10px] font-bold uppercase mt-1 opacity-60" style={{ color: colors.text }}>Strength</span>
            </div>

            {/* Cost - Top Right */}
            <div className="absolute top-6 right-6 w-20 h-20 flex flex-col items-center justify-center">
                <div
                    className="w-16 h-16 rounded-full border-4 flex items-center justify-center text-3xl font-black shadow-inner"
                    style={{ borderColor: colors.accent, color: colors.text, backgroundColor: 'white' }}
                >
                    {unit.cost}
                </div>
                <span className="text-[10px] font-bold uppercase mt-1 opacity-60" style={{ color: colors.text }}>Cost</span>
            </div>

            {/* Bottom Row: Stats and Type */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-between px-10 items-end">
                {/* Movement */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black uppercase tracking-widest opacity-40 mb-1" style={{ color: colors.text }}>MOV</span>
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black border-2"
                        style={{ color: colors.text, borderColor: colors.text }}
                    >
                        {unit.movement}
                    </div>
                </div>

                {/* Type Symbol / Tag */}
                <div className="flex flex-col items-center mb-1">
                    <div
                        className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm"
                        style={{ backgroundColor: colors.text, color: 'white' }}
                    >
                        {unit.type}
                    </div>
                    {unit.subtype !== 'unit' && (
                        <span className="text-[10px] font-black italic uppercase tracking-tighter mt-1" style={{ color: colors.accent }}>
                            {unit.subtype}
                        </span>
                    )}
                </div>

                {/* Range */}
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black uppercase tracking-widest opacity-40 mb-1" style={{ color: colors.text }}>RNG</span>
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black border-2"
                        style={{ color: colors.text, borderColor: colors.text }}
                    >
                        {unit.range}
                    </div>
                </div>
            </div>

            {/* Expansion Tag */}
            <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30" style={{ color: colors.text }}>
                    {unit.expansion} expansion
                </span>
            </div>
        </div>
    );
};

export default Sticker;

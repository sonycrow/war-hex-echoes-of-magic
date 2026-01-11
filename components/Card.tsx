import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
    card: CardType;
    lang: 'es' | 'en';
    t: any; // Now accepting translations object
}

const Card: React.FC<CardProps> = ({ card, lang, t }) => {
    const type = card.type.toLowerCase();
    const isSpell = type === 'arcane';
    const isTactic = type === 'tactics';
    const isSection = type === 'section';

    // Map categories to "Roles" for the footer strip
    const roleColor = isTactic ? 'bg-red-800' : isSpell ? 'bg-purple-900' : 'bg-blue-800';
    const roleText = isTactic ? t.cardTypes.tactics :
        isSpell ? t.cardTypes.arcane :
            t.cardTypes.section;

    return (
        <div
            id={`card-${card.id}`}
            className="relative w-[320px] h-[460px] bg-[#f4ece1] shadow-2xl overflow-hidden flex flex-col"
            style={{
                fontFamily: "'Inter', sans-serif",
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.2)',
            }}
        >
            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/light-paper-fibers.png')]" />

            {/* Worn Edges Effect */}
            <div className="absolute inset-0 border-2 border-black/10 m-1 pointer-events-none" />

            {/* Title Block - Historical Document Look */}
            <div className="pt-6 px-4 text-center z-10">
                <h2
                    className="text-2xl font-black text-slate-900 leading-none tracking-widest uppercase mb-0.5"
                    style={{ fontFamily: "'Pirata One', cursive", textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}
                >
                    {card.name[lang]}
                </h2>
                <div className="h-[2px] w-24 bg-slate-900/20 mx-auto" />
            </div>

            {/* Illustration Area with Vignette/Blur blend */}
            <div className="relative h-48 mt-2 overflow-hidden">
                <div className="absolute inset-0 z-10" style={{
                    background: 'radial-gradient(circle, transparent 30%, #f4ece1 100%)'
                }} />
                <img
                    src={card.imageUrl}
                    alt={card.name[lang]}
                    className="w-full h-full object-cover filter saturate-[0.8] contrast-[1.1]"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x200?text=${encodeURIComponent(t.placeholderArt || 'Art')}`;
                    }}
                />

                {/* Count badge - Wax Seal style */}
                <div className="absolute top-2 right-4 z-20 w-10 h-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-900 rounded-full rotate-12 shadow-lg border border-red-950/50" />
                    <span className="relative text-white font-black text-xs z-10" style={{ fontFamily: "'Germania One', system-ui" }}>
                        x{card.count}
                    </span>
                </div>
            </div>

            {/* Content Area - Centralized Ability Text */}
            <div className="px-6 py-4 flex flex-col justify-center flex-1 text-center z-10">
                <div className="flex flex-col gap-4">
                    <div className="group">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                            {t.maneuverA}
                        </span>
                        <p className="text-lg leading-relaxed text-slate-800 font-bold" style={{ fontFamily: "'Almendra Display', serif" }}>
                            {card.effectA[lang]}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 opacity-30">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-900 to-transparent" />
                        <div className="w-1 h-1 rotate-45 bg-slate-900" />
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-900 to-transparent" />
                    </div>

                    <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                            {t.maneuverB}
                        </span>
                        <p className="text-lg leading-relaxed text-slate-800 font-bold" style={{ fontFamily: "'Almendra Display', serif" }}>
                            {card.effectB[lang]}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Role Strip */}
            <div className={`${roleColor} py-2 px-1 text-center shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-20 border-t border-white/10`}>
                <span className="text-white text-xs font-black tracking-[0.3em] pl-[0.3em] font-sans opacity-95">
                    {roleText}
                </span>
            </div>

            {/* ID Stamp */}
            <div className="absolute bottom-1 right-2 opacity-20 pointer-events-none">
                <span className="text-[8px] font-mono font-black text-white">{card.id}</span>
            </div>
        </div>
    );
};

export default Card;

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
    const isTactic = type === 'tactic';
    const isSection = type === 'section';

    // Map categories to "Roles" for the footer strip
    const roleText = isTactic ? t.cardTypes.tactic :
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
            <div className="absolute inset-0 opacity-[0.06] bg-center bg-cover bg-[url('/assets/img/texture.png')]" />

            {/* Worn Edges Effect */}
            <div className="absolute inset-0 border-2 border-black/10 m-2 pointer-events-none rounded-2xl" />

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
            <div className="relative h-32 m-4 mt-2 mb-2 overflow-hidden">
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
            </div>

            {/* Content Area - Centralized Ability Text */}
            <div className="px-6 py-4 flex flex-col justify-center flex-1 text-center z-10">
                <div className="flex flex-col gap-4">
                    <div className="group">
                        <p className="text-lg leading-relaxed text-slate-800 font-bold" style={{ fontFamily: "'Almendra Display', serif" }}>
                            <span className="font-black text-slate-400 uppercase tracking-widest">A:</span>
                            {card.effectA[lang]}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 opacity-30">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-900 to-transparent" />
                        <div className="w-1 h-1 rotate-45 bg-slate-900" />
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-900 to-transparent" />
                    </div>

                    <div>
                        <p className="text-lg leading-relaxed text-slate-800 font-bold" style={{ fontFamily: "'Almendra Display', serif" }}>
                            <span className="font-black text-slate-400 uppercase tracking-widest">B:</span>
                            {card.effectB[lang]}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Role Strip - Floating Banner */}
            <div className="relative w-full h-16 flex items-center justify-center z-20 mt-auto mb-4">
                <img
                    src={`/assets/img/banner_${type}.png`}
                    alt=""
                    className="absolute h-full w-auto object-contain pointer-events-none drop-shadow-xl"
                />
                <span className="text-2xl text-white italic leading-none tracking-widest mb-[-4px] z-20"
                    style={{ fontFamily: "'Pirata One', cursive", textShadow: '0 1px 0 rgba(255,255,255,0.8)' }}>
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

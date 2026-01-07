import React from 'react';

interface GoldCoinProps {
    value: number;
}

const GoldCoin: React.FC<GoldCoinProps> = ({ value }) => (
    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-2 border-amber-700/30 shadow-sm text-amber-950 font-black text-sm relative group cursor-default select-none">
        <div className="absolute inset-0.5 rounded-full border border-white/30 pointer-events-none"></div>
        <span className="drop-shadow-sm z-10">{value}</span>
        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
);

export default GoldCoin;

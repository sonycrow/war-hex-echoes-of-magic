import React from 'react';
import DataTable from '../components/DataTable';
import GoldCoin from '../components/GoldCoin';
import { Unit } from '../types';

interface UnitsViewProps {
    lang: 'es' | 'en';
    data: Unit[];
    t: any;
}

const UnitsView: React.FC<UnitsViewProps> = ({ lang, data, t }) => {
    const viewsT = t.views.units;
    const defs = t.definitions;

    const processedData = React.useMemo(() => {
        return data.map(u => {
            const nameEn = u.name.en.toLowerCase()
                .replace(/\s+/g, '-')     // spaces to hyphens
                .replace(/[^\w-]/g, ''); // remove non-word chars except hyphens

            return {
                ...u,
                imageUrl: `/assets/blocks/units/${u.expansion}/${u.expansion}_${u.faction}_${nameEn}.png`
            };
        });
    }, [data]);

    return (
        <DataTable<Unit & { imageUrl: string }>
            lang={lang}
            title={viewsT.title}
            data={processedData}
            searchKeys={['id', 'faction', 'type', 'subtype']}
            columns={[
                {
                    key: 'faction',
                    label: viewsT.faction,
                    sortable: true,
                    render: (u) => (
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${u.faction === 'amazons' ? 'bg-orange-50 text-orange-800 border-orange-100' :
                            u.faction === 'barbarians' ? 'bg-red-50 text-red-800 border-red-100' :
                                u.faction === 'daemons' || u.faction === 'inferno' ? 'bg-purple-50 text-purple-800 border-purple-100' :
                                    u.faction === 'dwarves' ? 'bg-indigo-50 text-indigo-800 border-indigo-100' :
                                        u.faction === 'elves' ? 'bg-green-50 text-green-800 border-green-100' :
                                            u.faction === 'orcs' ? 'bg-amber-50 text-amber-800 border-amber-100' :
                                                u.faction === 'undead' ? 'bg-slate-50 text-slate-800 border-slate-100' :
                                                    'bg-blue-50 text-blue-800 border-blue-100'
                            }`}>
                            {defs.factions[u.faction] || u.faction}
                        </span>
                    )
                },
                { key: 'name', label: viewsT.name, sortable: true, render: (u) => <span className="font-bold text-slate-900">{u.name[lang]}</span> },
                {
                    key: 'type',
                    label: viewsT.type,
                    sortable: true,
                    render: (u) => (
                        <div className="flex flex-col gap-0.5">
                            <span className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">{defs.unitTypes[u.type] || u.type}</span>
                            {u.subtype !== 'unit' && (
                                <span className="text-[9px] font-black text-amber-600 uppercase tracking-tighter italic">{defs.unitSubtypes[u.subtype] || u.subtype}</span>
                            )}
                        </div>
                    )
                },
                { key: 'strength', label: viewsT.strength, sortable: true, render: (u) => <div className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 text-slate-900 font-bold border border-slate-200">{u.strength}</div> },
                { key: 'movement', label: 'MOV', sortable: true },
                { key: 'range', label: 'RNG', sortable: true },
                { key: 'cost', label: viewsT.cost, sortable: true, render: (u) => <GoldCoin value={u.cost} /> },
                { key: 'rules', label: viewsT.special, render: (u) => <span className="text-xs text-slate-500 font-medium leading-relaxed">{u.rules[lang]}</span> },
            ]}
        />
    );
};

export default UnitsView;

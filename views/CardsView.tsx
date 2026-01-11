import React from 'react';
import DataTable from '../components/DataTable';
import { Card } from '../types';

interface CardsViewProps {
    lang: 'es' | 'en';
    data: Card[];
    t: any;
}

const CardsView: React.FC<CardsViewProps> = ({ lang, data, t }) => {
    const cardsT = t.views.cards;

    return (
        <DataTable<Card>
            lang={lang}
            title={cardsT.title}
            data={data}
            searchKeys={['id', 'type']}
            columns={[
                {
                    key: 'type',
                    label: cardsT.type,
                    sortable: true,
                    render: (c) => (
                        <span className={`text-[10px] uppercase tracking-wider font-black ${c.type === 'arcane' ? 'text-purple-600' :
                            c.type === 'tactic' ? 'text-red-600' :
                                'text-blue-600'
                            }`}>
                            {cardsT.cardTypes[c.type.toLowerCase()] || c.type}
                        </span>
                    )
                },
                { key: 'name', label: cardsT.name, sortable: true, render: (c) => <span className="font-bold text-slate-900">{c.name[lang]}</span> },
                { key: 'count', label: '#', sortable: true, render: (c) => <span className="text-slate-400 font-mono text-xs">x{c.count}</span> },
                { key: 'effectA', label: cardsT.effectA, render: (c) => <div className="text-xs font-medium text-slate-700"><span className="text-amber-600 font-black mr-1 uppercase">A:</span>{c.effectA[lang]}</div> },
                { key: 'effectB', label: cardsT.effectB, render: (c) => <div className="text-xs font-medium text-slate-400"><span className="text-slate-300 font-black mr-1 uppercase">B:</span>{c.effectB[lang]}</div> },
            ]}
        />
    );
};

export default CardsView;

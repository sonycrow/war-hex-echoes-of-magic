import React from 'react';
import DataTable from '../components/DataTable';
import { Card } from '../types';

interface CardsViewProps {
    lang: 'es' | 'en';
    data: Card[];
    t: any;
}

const CardsView: React.FC<CardsViewProps> = ({ lang, data, t }) => {
    const viewsT = t.views.cards;
    const defs = t.definitions;

    return (
        <DataTable<Card>
            lang={lang}
            title={viewsT.title}
            data={data}
            searchKeys={['id', 'category']}
            columns={[
                {
                    key: 'category',
                    label: viewsT.category,
                    sortable: true,
                    render: (c) => (
                        <span className={`text-[10px] uppercase tracking-wider font-black ${c.category.en === 'Spell' ? 'text-purple-600' :
                            c.category.en === 'Tactics' ? 'text-red-600' :
                                'text-blue-600'
                            }`}>
                            {c.category[lang]}
                        </span>
                    )
                },
                { key: 'name', label: viewsT.name, sortable: true, render: (c) => <span className="font-bold text-slate-900">{c.name[lang]}</span> },
                { key: 'count', label: '#', sortable: true, render: (c) => <span className="text-slate-400 font-mono text-xs">x{c.count}</span> },
                { key: 'effectA', label: viewsT.effectA, render: (c) => <div className="text-xs font-medium"><span className="text-amber-600 font-black mr-1 uppercase">A:</span>{c.effectA[lang]}</div> },
                { key: 'effectB', label: viewsT.effectB, render: (c) => <div className="text-xs font-medium text-slate-400"><span className="text-slate-300 font-black mr-1 uppercase">B:</span>{c.effectB[lang]}</div> },
            ]}
        />
    );
};

export default CardsView;

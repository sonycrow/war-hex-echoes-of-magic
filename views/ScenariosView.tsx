import React from 'react';
import DataTable from '../components/DataTable';
import { Scenario } from '../types';

interface ScenariosViewProps {
    lang: 'es' | 'en';
    data: Scenario[];
    t: any;
}

const ScenariosView: React.FC<ScenariosViewProps> = ({ lang, data, t }) => {
    const viewsT = t.views.scenarios;
    const defs = t.definitions;

    return (
        <DataTable<Scenario>
            lang={lang}
            title={viewsT.title}
            data={data}
            searchKeys={['id']}
            columns={[
                { key: 'name', label: viewsT.name, sortable: true, render: (s) => <span className="font-bold text-slate-900">{s.name[lang]}</span> },
                {
                    key: 'difficulty',
                    label: viewsT.difficulty,
                    sortable: true,
                    render: (s) => (
                        <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${s.difficulty.en === 'Easy' ? 'bg-green-100 text-green-800' :
                            s.difficulty.en === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {s.difficulty[lang]}
                        </span>
                    )
                },
                { key: 'description', label: viewsT.description, render: (s) => s.description[lang] },
                { key: 'setup', label: 'Setup', render: (s) => s.setup[lang] },
            ]}
        />
    );
};

export default ScenariosView;

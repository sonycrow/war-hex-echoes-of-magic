import React from 'react';
import DataTable from '../components/DataTable';
import { Terrain } from '../types';

interface TerrainViewProps {
    lang: 'es' | 'en';
    data: Terrain[];
    t: any;
}

const TerrainView: React.FC<TerrainViewProps> = ({ lang, data, t }) => {
    const viewsT = t.views.terrain;

    return (
        <DataTable<Terrain>
            lang={lang}
            title={viewsT.title}
            data={data}
            searchKeys={['id']}
            columns={[
                { key: 'name', label: viewsT.name, sortable: true, render: (tNode) => <span className="font-bold text-slate-900">{tNode.name[lang]}</span> },
                { key: 'effectMovement', label: viewsT.movement, render: (tNode) => tNode.effectMovement[lang] },
                { key: 'effectCombat', label: viewsT.combat, render: (tNode) => tNode.effectCombat[lang] },
            ]}
        />
    );
};

export default TerrainView;

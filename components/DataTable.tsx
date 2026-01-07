import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import Modal from './Modal';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys: (keyof T)[];
  title: string;
  lang: 'es' | 'en';
}

function DataTable<T extends { id: string | number, imageUrl: string }>({
  data,
  columns,
  searchKeys,
  title,
  lang
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [modalState, setModalState] = useState<{ isOpen: boolean; item: T | null }>({
    isOpen: false,
    item: null,
  });

  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return data.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key];
        if (typeof val === 'object' && val !== null) {
          // It's a LocalizedString
          return Object.values(val).some(v => String(v).toLowerCase().includes(search));
        }
        return String(val).toLowerCase().includes(search);
      })
    );
  }, [data, searchTerm, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Handle localized strings for sorting (use current lang)
      if (typeof valA === 'object' && valA !== null && (valA as any)[lang]) {
        valA = (valA as any)[lang];
        valB = (valB as any)[lang];
      }

      if (valA < valB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valA > valB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig, lang]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">{title}</h2>
          <p className="text-slate-400 font-medium text-sm">{filteredData.length} {lang === 'es' ? 'entradas encontradas en el archivo' : 'entries found in archives'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input
              type="text"
              placeholder={lang === 'es' ? "Filtro de búsqueda..." : "Filter search..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-sm text-slate-600 font-medium placeholder-slate-300 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-xl shadow-slate-200/50">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-100">
            <tr>
              <th className="p-6 w-24 text-center">Visual</th>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`p-6 ${col.sortable ? 'cursor-pointer hover:text-slate-900 transition-colors' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {sortConfig?.key === col.key && (
                      <div className="text-slate-900">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                  <td className="p-6 text-center">
                    <button
                      onClick={() => setModalState({ isOpen: true, item })}
                      className="relative inline-block w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5"
                    >
                      <img src={item.imageUrl} alt="Item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye size={20} className="text-white" />
                      </div>
                    </button>
                  </td>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="p-6 text-sm text-slate-600 align-middle font-medium">
                      {col.render ? col.render(item) : String(item[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-20 text-center text-slate-300 italic font-medium">
                  {lang === 'es' ? "No se han encontrado registros en el Codex" : "No records found in the Codex"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalState.item && (
        <Modal
          isOpen={modalState.isOpen}
          imageUrl={modalState.item.imageUrl}
          title={(modalState.item as any).name?.[lang] || (modalState.item as any).id}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          lang={lang}
        />
      )}
    </div>
  );
}

export default DataTable;

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
  onGenerate: (item: T) => void;
  generatingId: string | null;
}

function DataTable<T extends { id: string | number, imageUrl: string, name: string }>({ 
  data, 
  columns, 
  searchKeys, 
  title, 
  lang,
  onGenerate,
  generatingId
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
    return data.filter((item) =>
      searchKeys.some((key) =>
        String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchKeys]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-800 uppercase tracking-tight">{title}</h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={lang === 'es' ? "Buscar..." : "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 text-slate-700 placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4 w-20 text-center">Img</th>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`p-4 ${col.sortable ? 'cursor-pointer hover:text-slate-800 transition-colors' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortConfig?.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedData.length > 0 ? (
              sortedData.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setModalState({ isOpen: true, item })}
                      className="group relative inline-block w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition-all"
                    >
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/20 hidden group-hover:flex items-center justify-center backdrop-blur-[1px]">
                         <Eye size={18} className="text-white drop-shadow-md" />
                      </div>
                    </button>
                  </td>
                  {columns.map((col) => (
                    <td key={String(col.key)} className="p-4 text-sm text-slate-600 align-middle font-medium">
                      {col.render ? col.render(item) : String(item[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-12 text-center text-slate-400 italic">
                  {lang === 'es' ? "No se encontraron resultados" : "No results found"}
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
          title={modalState.item.name}
          onClose={() => setModalState({ ...modalState, isOpen: false })}
          onGenerate={() => modalState.item && onGenerate(modalState.item)}
          isGenerating={generatingId === String(modalState.item.id)}
          lang={lang}
        />
      )}
    </div>
  );
}

export default DataTable;
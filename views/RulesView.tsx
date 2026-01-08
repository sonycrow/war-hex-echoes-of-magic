import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, BookOpen } from 'lucide-react';

const ListContext = createContext<'ul' | 'ol' | null>(null);

const RulesView = ({ lang }: { lang: 'es' | 'en' }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`./rules/rules_${lang}.md`);
        if (!response.ok) {
          throw new Error(lang === 'es' ? 'No se pudo cargar el archivo de reglas.' : 'Could not load the rules file.');
        }
        const text = await response.text();
        setContent(text);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, [lang]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest">
          {lang === 'es' ? 'Cargando reglas...' : 'Loading rules...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-red-500">
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 px-4 md:px-0">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mb-6 shadow-inner">
          <BookOpen size={32} />
        </div>
        <p className="text-amber-600 font-bold uppercase tracking-[0.2em] text-xs mb-2">
          {lang === 'es' ? 'Manual de Referencia' : 'Reference Manual'}
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-16 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-30 -ml-32 -mb-32" />

        <div className="relative z-10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-12 border-b-4 border-amber-500 pb-6 inline-block" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-3xl font-black text-slate-800 mt-16 mb-8 flex items-center" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-xl font-bold text-slate-900 mt-10 mb-4 border-l-4 border-amber-500 pl-5 py-1" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-slate-600 leading-[1.8] mb-6 text-lg" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ListContext.Provider value="ul">
                  <ul className="space-y-4 mb-8 ml-2" {...props} />
                </ListContext.Provider>
              ),
              ol: ({ node, ...props }) => (
                <ListContext.Provider value="ol">
                  <ol className="list-decimal space-y-4 mb-8 ml-6 text-slate-600 font-medium" {...props} />
                </ListContext.Provider>
              ),
              li: ({ node, ...props }) => {
                const listType = useContext(ListContext);
                return (
                  <li className="flex items-start gap-4 text-slate-600">
                    {(!listType || listType === 'ul') && (
                      <span className="mt-2 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    )}
                    <span className="text-lg leading-relaxed">{props.children}</span>
                  </li>
                );
              },
              strong: ({ node, ...props }) => (
                <strong className="font-extrabold text-slate-900 bg-amber-50 px-1 rounded" {...props} />
              ),
              table: ({ node, ...props }) => (
                <div className="my-12 overflow-hidden rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20">
                  <table className="w-full border-collapse" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => (
                <thead className="bg-slate-900" {...props} />
              ),
              th: ({ node, ...props }) => (
                <th className="px-6 py-5 text-left text-sm font-black text-white uppercase tracking-widest" {...props} />
              ),
              td: ({ node, ...props }) => (
                <td className="px-6 py-5 text-sm md:text-base text-slate-600 border-t border-slate-50 font-medium" {...props} />
              ),
              tr: ({ node, ...props }) => (
                <tr className="hover:bg-slate-50/50 transition-colors" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <div className="my-10 border-l-[6px] border-amber-500 bg-gradient-to-r from-amber-50 to-transparent p-8 rounded-r-3xl italic text-slate-700 text-xl font-medium shadow-sm">
                  {props.children}
                </div>
              ),
              hr: () => <hr className="my-16 border-slate-100" />,
              code: ({ node, ...props }) => (
                <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg text-sm font-mono" {...props} />
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default RulesView;

import React, { useState, useCallback, useEffect } from 'react';
import { Menu, X, Swords, ScrollText, Map, BookOpen, Layers, Loader2 } from 'lucide-react';
import DataTable from './components/DataTable';
import RulesView from './views/RulesView';
import { Unit, Card, Terrain, Scenario, ViewState } from './types';

const NavLink = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ElementType, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group font-semibold text-sm ${
      active 
        ? 'bg-slate-900 text-white shadow-lg' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon size={18} className={active ? 'text-white' : 'group-hover:text-slate-900 text-slate-400'} />
    <span className="tracking-tight">{label}</span>
  </button>
);

const GoldCoin = ({ value }: { value: number }) => (
  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-2 border-amber-700/30 shadow-sm text-amber-950 font-black text-sm relative group cursor-default select-none">
    <div className="absolute inset-0.5 rounded-full border border-white/30 pointer-events-none"></div>
    <span className="drop-shadow-sm z-10">{value}</span>
    <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
  </div>
);

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('units');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  
  // Estado para los datos cargados dinámicamente
  const [gameData, setGameData] = useState<{
    UNITS: any;
    CARDS: any;
    TERRAIN: any;
    SCENARIOS: any;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleNav = useCallback((view: ViewState) => {
    setCurrentView(view);
    closeSidebar();
  }, [closeSidebar]);

  // Efecto para cargar los JSON al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const [unitsRes, cardsRes, terrainRes, scenariosRes] = await Promise.all([
          fetch('./data/units.json'),
          fetch('./data/cards.json'),
          fetch('./data/terrain.json'),
          fetch('./data/scenarios.json')
        ]);

        if (!unitsRes.ok || !cardsRes.ok || !terrainRes.ok || !scenariosRes.ok) {
          throw new Error("Error loading data files");
        }

        const units = await unitsRes.json();
        const cards = await cardsRes.json();
        const terrain = await terrainRes.json();
        const scenarios = await scenariosRes.json();

        setGameData({
          UNITS: units,
          CARDS: cards,
          TERRAIN: terrain,
          SCENARIOS: scenarios
        });
      } catch (err) {
        console.error("Failed to load codex data:", err);
        setError("Error cargando el Codex. Por favor verifique los archivos JSON.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const labels = {
    es: { units: 'Unidades', cards: 'Cartas', terrain: 'Terreno', scenarios: 'Escenarios', rules: 'Reglamento', title: 'WAR-HEX' },
    en: { units: 'Units', cards: 'Cards', terrain: 'Terrain', scenarios: 'Scenarios', rules: 'Rulebook', title: 'WAR-HEX' },
  };
  const t = labels[lang];

  // Pantalla de Carga
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Cargando Codex...</p>
      </div>
    );
  }

  // Pantalla de Error
  if (error || !gameData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-red-600 gap-4 p-8 text-center">
        <p className="font-bold">{error || "No se pudieron cargar los datos."}</p>
      </div>
    );
  }

  const DATA = {
    UNITS: gameData.UNITS[lang] as Unit[],
    CARDS: gameData.CARDS[lang] as Card[],
    TERRAIN: gameData.TERRAIN[lang] as Terrain[],
    SCENARIOS: gameData.SCENARIOS[lang] as Scenario[]
  };

  const renderContent = () => {
    const commonProps = { lang };

    switch (currentView) {
      case 'units':
        return (
          <DataTable<Unit>
            {...commonProps}
            title={lang === 'es' ? "Unidades de Batalla" : "Battle Units"}
            data={DATA.UNITS}
            searchKeys={['name', 'faction', 'type', 'special']}
            columns={[
              { key: 'faction', label: lang === 'es' ? 'Facción' : 'Faction', sortable: true, render: (u) => <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${u.faction === 'Humanos' ? 'bg-blue-50 text-blue-800 border-blue-100' : u.faction === 'Elfos' ? 'bg-green-50 text-green-800 border-green-100' : u.faction === 'Orcos' ? 'bg-red-50 text-red-800 border-red-100' : 'bg-purple-50 text-purple-800 border-purple-100'}`}>{u.faction}</span> },
              { key: 'name', label: lang === 'es' ? 'Nombre' : 'Name', sortable: true, render: (u) => <span className="font-bold text-slate-900">{u.name}</span> },
              { key: 'type', label: lang === 'es' ? 'Tipo' : 'Type', sortable: true, render: (u) => <span className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">{u.type}</span> },
              { key: 'strength', label: lang === 'es' ? 'Fuerza' : 'STR', sortable: true, render: (u) => <div className="w-8 h-8 flex items-center justify-center rounded bg-slate-100 text-slate-900 font-bold border border-slate-200">{u.strength}</div> },
              { key: 'movement', label: 'MOV', sortable: true },
              { key: 'range', label: 'RNG', sortable: true },
              { key: 'cost', label: lang === 'es' ? 'Coste' : 'Cost', sortable: true, render: (u) => <GoldCoin value={u.cost} /> },
              { key: 'special', label: lang === 'es' ? 'Especial' : 'Special', render: (u) => <span className="text-xs text-slate-500 font-medium leading-relaxed">{u.special}</span> },
            ]}
          />
        );
      case 'cards':
        return (
          <DataTable<Card>
            {...commonProps}
            title={lang === 'es' ? "Mazo de Mando" : "Command Deck"}
            data={DATA.CARDS}
            searchKeys={['name', 'category', 'effectA', 'effectB']}
            columns={[
              { key: 'category', label: lang === 'es' ? 'Categoría' : 'Category', sortable: true, render: (c) => <span className={`text-[10px] uppercase tracking-wider font-black ${c.category === 'Hechizo' ? 'text-purple-600' : c.category === 'Táctica' ? 'text-red-600' : 'text-blue-600'}`}>{c.category}</span> },
              { key: 'name', label: lang === 'es' ? 'Nombre' : 'Name', sortable: true, render: (c) => <span className="font-bold text-slate-900">{c.name}</span> },
              { key: 'count', label: '#', sortable: true, render: (c) => <span className="text-slate-400 font-mono text-xs">x{c.count}</span> },
              { key: 'effectA', label: lang === 'es' ? 'Efecto A' : 'Effect A', render: (c) => <div className="text-xs font-medium"><span className="text-amber-600 font-black mr-1 uppercase">A:</span>{c.effectA}</div> },
              { key: 'effectB', label: lang === 'es' ? 'Efecto B' : 'Effect B', render: (c) => <div className="text-xs font-medium text-slate-400"><span className="text-slate-300 font-black mr-1 uppercase">B:</span>{c.effectB}</div> },
            ]}
          />
        );
      case 'terrain':
        return (
          <DataTable<Terrain>
            {...commonProps}
            title={lang === 'es' ? "Terreno" : "Terrain"}
            data={DATA.TERRAIN}
            searchKeys={['name', 'effectMovement', 'effectCombat']}
            columns={[
              { key: 'name', label: lang === 'es' ? 'Nombre' : 'Name', sortable: true, render: (t) => <span className="font-bold text-slate-900">{t.name}</span> },
              { key: 'effectMovement', label: lang === 'es' ? 'Movimiento' : 'Movement' },
              { key: 'effectCombat', label: lang === 'es' ? 'Combate' : 'Combat' },
            ]}
          />
        );
      case 'scenarios':
        return (
          <DataTable<Scenario>
            {...commonProps}
            title={lang === 'es' ? "Escenarios" : "Scenarios"}
            data={DATA.SCENARIOS}
            searchKeys={['name', 'description', 'setup']}
            columns={[
              { key: 'name', label: lang === 'es' ? 'Escenario' : 'Scenario', sortable: true, render: (s) => <span className="font-bold text-slate-900">{s.name}</span> },
              { key: 'difficulty', label: lang === 'es' ? 'Dificultad' : 'Difficulty', sortable: true, render: (s) => <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${s.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' : s.difficulty === 'Media' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{s.difficulty}</span> },
              { key: 'description', label: lang === 'es' ? 'Descripción' : 'Description' },
              { key: 'setup', label: 'Setup' },
            ]}
          />
        );
      case 'rules':
        return <RulesView lang={lang} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20 md:hidden animate-in fade-in duration-200" onClick={closeSidebar} />
      )}

      <aside className={`fixed md:relative z-30 h-full w-72 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 shadow-2xl md:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Swords className="text-white" size={24} />
            </div>
            <div>
               <h1 className="font-black text-xl tracking-tight text-slate-900">WAR-HEX</h1>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CODEX v1.4</span>
            </div>
          </div>
          <button onClick={closeSidebar} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          <NavLink icon={Swords} label={t.units} active={currentView === 'units'} onClick={() => handleNav('units')} />
          <NavLink icon={ScrollText} label={t.cards} active={currentView === 'cards'} onClick={() => handleNav('cards')} />
          <NavLink icon={Map} label={t.terrain} active={currentView === 'terrain'} onClick={() => handleNav('terrain')} />
          <NavLink icon={Layers} label={t.scenarios} active={currentView === 'scenarios'} onClick={() => handleNav('scenarios')} />
          <div className="my-6 border-t border-slate-100"></div>
          <NavLink icon={BookOpen} label={t.rules} active={currentView === 'rules'} onClick={() => handleNav('rules')} />
        </nav>

        <div className="p-6 pt-0 bg-white">
          <div className="flex bg-slate-100 rounded-xl p-1.5 border border-slate-200 shadow-inner">
            <button onClick={() => setLang('es')} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${lang === 'es' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>ESPAÑOL</button>
            <button onClick={() => setLang('en')} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>ENGLISH</button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <header className="md:hidden h-16 bg-white border-b border-slate-100 flex items-center px-6 justify-between shrink-0 shadow-sm z-10">
          <button onClick={toggleSidebar} className="text-slate-900"><Menu size={24} /></button>
          <span className="font-black text-slate-900 tracking-tighter">WAR-HEX</span>
          <div className="w-6"></div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-12">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
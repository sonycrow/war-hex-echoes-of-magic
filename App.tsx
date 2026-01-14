import React, { useState, useCallback, useEffect } from 'react';
import { Menu, Loader2 } from 'lucide-react';
import Sidebar from './components/Sidebar';
import UnitsView from './views/UnitsView';
import CardsView from './views/CardsView';
import TerrainView from './views/TerrainView';
import ScenariosView from './views/ScenariosView';
import RulesView from './views/RulesView';
import StickersView from './views/StickersView';
import CardGeneratorView from './views/CardGeneratorView';
import MapEditorView from './views/MapEditorView';
import { Unit, Card, Terrain, Scenario, ViewState } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('units');
  const [lang, setLang] = useState<'es' | 'en'>('es');

  const [gameData, setGameData] = useState<{
    units: any[];
    cards: any[];
    terrain: any[];
    scenarios: any[];
  } | null>(null);
  const [locales, setLocales] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleNav = useCallback((view: ViewState) => {
    setCurrentView(view);
    closeSidebar();
  }, [closeSidebar]);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [uRes, cRes, tRes, sRes, esRes, enRes] = await Promise.all([
          fetch('./data/units.json'),
          fetch('./data/cards.json'),
          fetch('./data/terrain.json'),
          fetch('./data/scenarios.json'),
          fetch('./locales/es.json'),
          fetch('./locales/en.json')
        ]);

        if (!uRes.ok || !cRes.ok || !tRes.ok || !sRes.ok || !esRes.ok || !enRes.ok) {
          throw new Error("Error loading data or locale files");
        }

        const units = await uRes.json();
        const cards = await cRes.json();
        const terrain = await tRes.json();
        const scenarios = await sRes.json();
        const es = await esRes.json();
        const en = await enRes.json();

        setGameData({ units, cards, terrain, scenarios });
        setLocales({ es, en });

        // Handle initial routing based on hash
        const hash = window.location.hash.replace('#', '');
        if (hash) {
          const [view] = hash.split('?');
          if (['units', 'cards', 'terrain', 'scenarios', 'rules', 'stickers', 'card-generator', 'map-editor'].includes(view)) {
            setCurrentView(view as ViewState);
          }
        }
      } catch (err) {
        console.error("Failed to load codex data:", err);
        setError("Error cargando el Codex.");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-slate-900 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Cargando Codex...</p>
      </div>
    );
  }

  if (error || !gameData || !locales) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 text-red-600 gap-4 p-8 text-center">
        <p className="font-bold">{error || "No se pudieron cargar los datos."}</p>
      </div>
    );
  }

  const t = locales[lang];

  const renderContent = () => {
    switch (currentView) {
      case 'units':
        return <UnitsView lang={lang} data={gameData.units} t={t} />;
      case 'cards':
        return <CardsView lang={lang} data={gameData.cards} t={t} />;
      case 'terrain':
        return <TerrainView lang={lang} data={gameData.terrain} t={t} />;
      case 'scenarios':
        return <ScenariosView lang={lang} data={gameData.scenarios} t={t} />;
      case 'rules':
        return <RulesView lang={lang} />;
      case 'stickers':
        return <StickersView lang={lang} data={gameData.units} t={t} />;
      case 'card-generator':
        return <CardGeneratorView lang={lang} data={gameData.cards} t={t} />;
      case 'map-editor':
        return <MapEditorView lang={lang} data={{ terrain: gameData.terrain, units: gameData.units }} t={t} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        currentView={currentView}
        onNav={handleNav}
        lang={lang}
        onLangChange={setLang}
        t={t}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <header className="md:hidden h-16 bg-white border-b border-slate-100 flex items-center px-6 justify-between shrink-0 shadow-sm z-10">
          <button onClick={toggleSidebar} className="text-slate-900"><Menu size={24} /></button>
          <span className="font-black text-slate-900 tracking-tighter">{t.common.title}</span>
          <div className="w-6"></div>
        </header>

        <div className={`flex-1 overflow-y-auto ${(['stickers', 'card-generator'].includes(currentView)) ? '' : 'p-4 md:p-12'}`}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { Menu, X, Swords, ScrollText, Map, BookOpen, Layers, Globe } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import DataTable from './components/DataTable';
import RulesView from './views/RulesView';
import { getData } from './constants';
import { Unit, Card, Terrain, Scenario, ViewState } from './types';

// Sidebar Link Component
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
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group font-medium ${
      active 
        ? 'bg-slate-200 text-slate-900 shadow-sm' 
        : 'text-slate-500 hover:bg-slate-100 hover:text-amber-600'
    }`}
  >
    <Icon size={20} className={active ? 'text-slate-900' : 'group-hover:text-amber-600 text-slate-400'} />
    <span className="tracking-wide">{label}</span>
  </button>
);

const GoldCoin = ({ value }: { value: number }) => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-400 border-2 border-amber-600 shadow-sm text-amber-950 font-bold text-sm relative group cursor-default">
    {value}
    <div className="absolute inset-0 rounded-full bg-white/20 hidden group-hover:block"></div>
  </div>
);

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('units');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  
  // Image Generation State
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const rawData = getData(lang);

  // Merge static data with generated images
  const DATA = {
    ...rawData,
    UNITS: rawData.UNITS.map(u => ({ ...u, imageUrl: customImages[u.id] || u.imageUrl })),
    CARDS: rawData.CARDS.map(c => ({ ...c, imageUrl: customImages[c.id] || c.imageUrl })),
    TERRAIN: rawData.TERRAIN.map(t => ({ ...t, imageUrl: customImages[t.id] || t.imageUrl })),
    SCENARIOS: rawData.SCENARIOS.map(s => ({ ...s, imageUrl: customImages[s.id] || s.imageUrl })),
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleNav = (view: ViewState) => {
    setCurrentView(view);
    closeSidebar();
  };

  const handleGenerateImage = async (item: any) => {
    if (!process.env.API_KEY) {
      alert("API Key is missing in environment variables.");
      return;
    }

    setGeneratingId(item.id);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct a rich prompt based on available fields
      const details = item.special || item.effectA || item.effectMovement || item.description || "";
      const typeInfo = item.type || item.category || "";
      const factionInfo = item.faction ? `Faction: ${item.faction}` : "";
      
      const prompt = `Fantasy board game illustration, detailed digital painting style. 
      Subject: ${item.name}. ${factionInfo} ${typeInfo}. 
      Details: ${details}. 
      Atmosphere: Magical, serious, war-hex codex style, sharp focus, cinematic lighting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          const newUrl = `data:${mimeType};base64,${base64String}`;
          
          setCustomImages(prev => ({
            ...prev,
            [item.id]: newUrl
          }));
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        console.warn("No image found in response");
      }

    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setGeneratingId(null);
    }
  };

  const labels = {
    es: { units: 'Unidades', cards: 'Cartas', terrain: 'Terreno', scenarios: 'Escenarios', rules: 'Reglamento', title: 'WAR-HEX' },
    en: { units: 'Units', cards: 'Cards', terrain: 'Terrain', scenarios: 'Scenarios', rules: 'Rulebook', title: 'WAR-HEX' },
  };
  const t = labels[lang];

  const renderContent = () => {
    const commonProps = {
      lang,
      onGenerate: handleGenerateImage,
      generatingId: generatingId
    };

    switch (currentView) {
      case 'units':
        return (
          <DataTable<Unit>
            {...commonProps}
            title={lang === 'es' ? "Unidades de Batalla" : "Battle Units"}
            data={DATA.UNITS}
            searchKeys={['name', 'faction', 'type', 'special']}
            columns={[
              { key: 'faction', label: lang === 'es' ? 'Facción' : 'Faction', sortable: true, render: (u) => <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${u.faction === 'Humanos' ? 'bg-blue-50 text-blue-700 border-blue-200' : u.faction === 'Elfos' ? 'bg-green-50 text-green-700 border-green-200' : u.faction === 'Orcos' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>{u.faction}</span> },
              { key: 'name', label: lang === 'es' ? 'Nombre' : 'Name', sortable: true, render: (u) => <span className="font-bold text-slate-800">{u.name}</span> },
              { key: 'type', label: lang === 'es' ? 'Tipo' : 'Type', sortable: true, render: (u) => <span className="text-slate-500 font-mono text-xs uppercase">{u.type}</span> },
              { key: 'strength', label: lang === 'es' ? 'Fuerza' : 'STR', sortable: true, render: (u) => <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded">{u.strength}</span> },
              { key: 'movement', label: lang === 'es' ? 'Mov' : 'Mov', sortable: true },
              { key: 'range', label: lang === 'es' ? 'Rango' : 'Rng', sortable: true },
              { key: 'cost', label: lang === 'es' ? 'Coste' : 'Cost', sortable: true, render: (u) => <GoldCoin value={u.cost} /> },
              { key: 'special', label: lang === 'es' ? 'Especial' : 'Special', render: (u) => <span className="text-xs text-slate-500 italic">{u.special}</span> },
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
              { key: 'category', label: lang === 'es' ? 'Categoría' : 'Category', sortable: true, render: (c) => <span className={`text-xs uppercase tracking-wider font-bold ${c.category === 'Hechizo' ? 'text-purple-600' : c.category === 'Táctica' ? 'text-red-600' : 'text-blue-600'}`}>{c.category}</span> },
              { key: 'name', label: lang === 'es' ? 'Nombre' : 'Name', sortable: true, render: (c) => <span className="font-bold text-slate-800">{c.name}</span> },
              { key: 'count', label: '#', sortable: true, render: (c) => <span className="text-slate-400 font-mono">x{c.count}</span> },
              { key: 'effectA', label: lang === 'es' ? 'Efecto Principal' : 'Main Effect', render: (c) => <div className="text-sm"><span className="text-amber-600 font-bold mr-1">A:</span>{c.effectA}</div> },
              { key: 'effectB', label: lang === 'es' ? 'Alternativo' : 'Alternative', render: (c) => <div className="text-sm text-slate-500"><span className="text-slate-400 font-bold mr-1">B:</span>{c.effectB}</div> },
            ]}
          />
        );
      case 'terrain':
        return (
          <DataTable<Terrain>
            {...commonProps}
            title={lang === 'es' ? "Terreno y Obstáculos" : "Terrain & Obstacles"}
            data={DATA.TERRAIN}
            searchKeys={['name', 'effectMovement', 'effectCombat']}
            columns={[
              { key: 'name', label: lang === 'es' ? 'Nombre' : 'Name', sortable: true, render: (t) => <span className="font-bold text-green-700">{t.name}</span> },
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
              { key: 'name', label: lang === 'es' ? 'Escenario' : 'Scenario', sortable: true, render: (s) => <span className="font-bold text-slate-800">{s.name}</span> },
              { key: 'difficulty', label: lang === 'es' ? 'Dificultad' : 'Difficulty', sortable: true, render: (s) => <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${s.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' : s.difficulty === 'Media' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>{s.difficulty}</span> },
              { key: 'description', label: lang === 'es' ? 'Descripción' : 'Description' },
              { key: 'setup', label: 'Setup' },
            ]}
          />
        );
      case 'rules':
        return <RulesView lang={lang} />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 md:hidden animate-in fade-in duration-200"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-30 h-full w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out shadow-xl md:shadow-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Swords className="text-white" size={24} />
            </div>
            <div>
               <h1 className="font-extrabold text-xl tracking-tight text-slate-900">WAR-HEX</h1>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Codex System</span>
            </div>
          </div>
          <button onClick={closeSidebar} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2">
          <NavLink 
            icon={Swords} 
            label={t.units} 
            active={currentView === 'units'} 
            onClick={() => handleNav('units')} 
          />
          <NavLink 
            icon={ScrollText} 
            label={t.cards} 
            active={currentView === 'cards'} 
            onClick={() => handleNav('cards')} 
          />
          <NavLink 
            icon={Map} 
            label={t.terrain} 
            active={currentView === 'terrain'} 
            onClick={() => handleNav('terrain')} 
          />
          <NavLink 
            icon={Layers} 
            label={t.scenarios} 
            active={currentView === 'scenarios'} 
            onClick={() => handleNav('scenarios')} 
          />
          <div className="my-6 border-t border-slate-100"></div>
          <NavLink 
            icon={BookOpen} 
            label={t.rules} 
            active={currentView === 'rules'} 
            onClick={() => handleNav('rules')} 
          />
        </nav>

        {/* Language Selector in Sidebar */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe size={12} /> Language
            </span>
          </div>
          <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
            <button 
              onClick={() => setLang('es')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'es' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              ESPAÑOL
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${lang === 'en' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
            >
              ENGLISH
            </button>
          </div>
          <div className="mt-4 text-center text-xs text-slate-400">
            <p>v1.4.0 Codex</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative bg-slate-50">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between shrink-0 shadow-sm z-10">
          <button onClick={toggleSidebar} className="text-slate-800">
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-900">WAR-HEX</span>
          <div className="w-6"></div> {/* Spacer for center alignment */}
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 relative">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
import React from 'react';

const RulesView = ({ lang }: { lang: 'es' | 'en' }) => {
  if (lang === 'en') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
        <div className="text-center space-y-4 border-b border-slate-200 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            WAR-HEX: <span className="text-amber-600">ECHOES OF MAGIC</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">Consolidated Reference Manual (v1.3)</p>
        </div>

        <div className="space-y-8 text-slate-600 leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="bg-amber-100 text-amber-700 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-lg font-extrabold">1</span>
              Block System & Fog of War
            </h2>
            <ul className="list-disc pl-6 space-y-3 marker:text-amber-500">
              <li><strong className="text-slate-900">Component:</strong> Solid color wooden rectangular blocks per faction.</li>
              <li><strong className="text-slate-900">Positioning:</strong> Blocks stand <strong className="text-slate-900">upright</strong> facing the owner. The opponent sees only a wall of color, hiding unit identity (Fog of War) until combat or line of sight.</li>
              <li><strong className="text-slate-900">Strength Rotation:</strong> The top edge indicates current <strong className="text-slate-900">Strength (F)</strong> and attack dice. When damaged, rotate the block 90° counter-clockwise.</li>
              <li><strong className="text-slate-900">Scenario Economy:</strong> Armies are built with a budget of <strong className="text-amber-600">50 Gold Coins (💰)</strong>.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="bg-amber-100 text-amber-700 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-lg font-extrabold">2</span>
              Combat & Movement Rules
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 border-l-4 border-red-500 pl-3 mb-3">A. Attack Resolution</h3>
                <ul className="list-disc pl-6 space-y-2 marker:text-red-500">
                  <li><strong className="text-slate-900">Melee:</strong> Dice = Current Block Strength.</li>
                  <li><strong className="text-slate-900">Ranged (Memoir '44 Rule):</strong> Dice reduced by distance:
                    <ul className="list-circle pl-6 mt-2 space-y-1 text-slate-500">
                      <li>Range 1 hex: Full Strength.</li>
                      <li>Range 2 hex: Strength -1 die.</li>
                      <li>Range 3 hex: Strength -2 dice.</li>
                    </ul>
                  </li>
                  <li className="italic text-slate-400">Note: Minimum attack is 0 dice if penalty equals or exceeds strength.</li>
                </ul>
              </div>
              
              <div className="bg-amber-50 p-5 rounded-lg border border-amber-100 text-amber-900">
                 <strong className="text-amber-700">⚡ Impetuous Charge:</strong> <strong className="text-slate-900">Heavy</strong> units moving 2+ hexes before attacking gain <strong className="text-green-600">+1 die</strong> in melee and <strong className="text-green-600">ignore the first flag</strong> received that turn.
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="bg-amber-100 text-amber-700 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-lg font-extrabold">3</span>
              Mana System (💧)
            </h2>
            <p className="mb-6">Mana is the strategic resource allowing magical actions to alter the battle's fate.</p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-3">A. Generation & Storage</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm marker:text-blue-500 text-slate-700">
                  <li><strong className="text-slate-900">Accumulation:</strong> Mana is not lost at turn end.</li>
                  <li><strong className="text-slate-900">Cap:</strong> Max <strong className="text-blue-600">5 💧</strong>. Excess is lost.</li>
                  <li><strong className="text-slate-900">Methods:</strong>
                    <ol className="list-decimal pl-5 mt-1 space-y-1">
                      <li><strong className="text-slate-800">Altar Control:</strong> +1 💧 at start of turn per altar.</li>
                      <li><strong className="text-slate-800">Dice Sacrifice:</strong> On "Magic" roll, choose: 1 damage OR gain 1 💧.</li>
                    </ol>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-purple-600 mb-3">B. Spell Cards Usage</h3>
                <div className="space-y-4">
                  <div className="border border-purple-100 bg-purple-50 p-4 rounded-lg">
                    <span className="block text-xs uppercase tracking-widest text-purple-600 font-bold mb-1">Option A (Spell)</span>
                    <span className="text-sm text-slate-800">Pay 💧 cost. Potent effect.</span>
                  </div>
                  <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
                    <span className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Option B (Wildcard)</span>
                    <span className="text-sm text-slate-700">Discard to activate basic unit (no mana cost).</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Spanish Version (Default)
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="text-center space-y-4 border-b border-slate-200 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          WAR-HEX: <span className="text-amber-600">ECHOES OF MAGIC</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium">Manual de Referencia Consolidado (v1.3)</p>
      </div>

      <div className="space-y-8 text-slate-600 leading-relaxed">
        {/* Section 1 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="bg-amber-100 text-amber-700 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-lg font-extrabold">1</span>
            El Sistema de Bloques y Niebla de Guerra
          </h2>
          <ul className="list-disc pl-6 space-y-3 marker:text-amber-500">
            <li><strong className="text-slate-900">Componente:</strong> Bloques rectangulares de madera de color sólido por facción.</li>
            <li><strong className="text-slate-900">Posicionamiento:</strong> Los bloques se colocan <strong className="text-slate-900">de pie</strong> mirando al dueño. El oponente solo ve un muro de color, ocultando la identidad de la unidad (Niebla de Guerra) hasta que entra en combate o rango de visión.</li>
            <li><strong className="text-slate-900">Rotación de Fuerza:</strong> El borde superior indica la <strong className="text-slate-900">Fuerza (F)</strong> actual y el número de dados de ataque. Al recibir daño, se rota el bloque 90° a la izquierda.</li>
            <li><strong className="text-slate-900">Economía de Escenarios:</strong> Los ejércitos se construyen con un presupuesto de <strong className="text-amber-600">50 Monedas de Oro (💰)</strong>.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="bg-amber-100 text-amber-700 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-lg font-extrabold">2</span>
            Reglas de Combate y Movimiento
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 border-l-4 border-red-500 pl-3 mb-3">A. Resolución de Ataque</h3>
              <ul className="list-disc pl-6 space-y-2 marker:text-red-500">
                <li><strong className="text-slate-900">Cuerpo a Cuerpo (Melé):</strong> Dados = Fuerza Actual del bloque.</li>
                <li><strong className="text-slate-900">A Distancia (Regla Memoir '44):</strong> Se restan dados por la distancia al objetivo:
                  <ul className="list-circle pl-6 mt-2 space-y-1 text-slate-500">
                    <li>Distancia 1 hex: Fuerza completa.</li>
                    <li>Distancia 2 hex: Fuerza -1 dado.</li>
                    <li>Distancia 3 hex: Fuerza -2 dados.</li>
                  </ul>
                </li>
                <li className="italic text-slate-400">Nota: El ataque mínimo es siempre 0 dados si la penalización iguala o supera la fuerza.</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 p-5 rounded-lg border border-amber-100 text-amber-900">
               <strong className="text-amber-700">⚡ Carga Impetuosa:</strong> Las unidades <strong className="text-slate-900">Pesadas</strong> que muevan 2+ hexágonos antes de atacar ganan <strong className="text-green-600">+1 dado</strong> en melé e <strong className="text-green-600">ignoran la primera bandera</strong> recibida ese turno.
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="bg-amber-100 text-amber-700 w-10 h-10 rounded-full flex items-center justify-center mr-4 text-lg font-extrabold">3</span>
            El Sistema de Maná (💧)
          </h2>
          <p className="mb-6">El Maná es el recurso estratégico que permite ejecutar acciones mágicas y alterar el destino de la batalla.</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-blue-600 mb-3">A. Generación y Acumulación</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm marker:text-blue-500 text-slate-700">
                <li><strong className="text-slate-900">Acumulación:</strong> El maná no se pierde al final del turno.</li>
                <li><strong className="text-slate-900">Límite (Cap):</strong> Máximo de <strong className="text-blue-600">5 💧</strong>. Exceso se pierde.</li>
                <li><strong className="text-slate-900">Métodos:</strong>
                  <ol className="list-decimal pl-5 mt-1 space-y-1">
                    <li><strong className="text-slate-800">Control de Altares:</strong> +1 💧 al inicio del turno por altar.</li>
                    <li><strong className="text-slate-800">Sacrificio de Dados:</strong> Al sacar "Magia", elige: 1 daño o ganar 1 💧.</li>
                  </ol>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-purple-600 mb-3">B. Uso de Cartas de Hechizo</h3>
              <div className="space-y-4">
                <div className="border border-purple-100 bg-purple-50 p-4 rounded-lg">
                  <span className="block text-xs uppercase tracking-widest text-purple-600 font-bold mb-1">Opción A (Hechizo)</span>
                  <span className="text-sm text-slate-800">Pagar coste en 💧. Efecto potente.</span>
                </div>
                <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg">
                  <span className="block text-xs uppercase tracking-widest text-slate-500 font-bold mb-1">Opción B (Comodín)</span>
                  <span className="text-sm text-slate-700">Descartar para activar unidad básica (sin coste maná).</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RulesView;
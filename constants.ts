import { Unit, Card, Terrain, Scenario, Faction, UnitType } from './types';

// Helper to get data by language
export const getData = (lang: 'es' | 'en') => {
  if (lang === 'en') return DATA_EN;
  return DATA_ES;
};

const DATA_ES = {
  UNITS: [
    // Humanos
    { id: 'h1', faction: Faction.Humanos, name: 'Levas de Picas', type: UnitType.Ligera, strength: 3, movement: 2, range: 0, special: '+1 dado defensa junto a aliado.', cost: 2, imageUrl: 'https://picsum.photos/400/400?random=1' },
    { id: 'h2', faction: Faction.Humanos, name: 'Ballesteros', type: UnitType.Ligera, strength: 3, movement: 1, range: 3, special: 'Ignora bonus de terreno.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=2' },
    { id: 'h3', faction: Faction.Humanos, name: 'Espaderos', type: UnitType.Media, strength: 4, movement: 1, range: 0, special: 'Ignora 1 bandera.', cost: 3, imageUrl: 'https://picsum.photos/400/400?random=3' },
    { id: 'h4', faction: Faction.Humanos, name: 'Caballeros', type: UnitType.Pesada, strength: 4, movement: 3, range: 0, special: 'Bono de Carga.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=4' },
    { id: 'h5', faction: Faction.Humanos, name: 'Altar de Guerra', type: UnitType.Elite, strength: 4, movement: 1, range: 0, special: 'Aura: Repite 1 dado fallido a R1.', cost: 5, imageUrl: 'https://picsum.photos/400/400?random=5' },
    // Elfos
    { id: 'e1', faction: Faction.Elfos, name: 'Rastreadores', type: UnitType.Ligera, strength: 3, movement: 3, range: 0, special: 'Mueve 1 hex tras ataque.', cost: 3, imageUrl: 'https://picsum.photos/400/400?random=6' },
    { id: 'e2', faction: Faction.Elfos, name: 'Arq. Élite', type: UnitType.Ligera, strength: 3, movement: 2, range: 4, special: 'Ataca x2 si no mueve.', cost: 5, imageUrl: 'https://picsum.photos/400/400?random=7' },
    { id: 'e3', faction: Faction.Elfos, name: 'Guardia Plata', type: UnitType.Media, strength: 4, movement: 2, range: 0, special: 'No para en bosques.', cost: 3, imageUrl: 'https://picsum.photos/400/400?random=8' },
    { id: 'e4', faction: Faction.Elfos, name: 'Jinetes Venado', type: UnitType.Pesada, strength: 3, movement: 4, range: 0, special: 'Se retira antes de recibir daño.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=9' },
    { id: 'e5', faction: Faction.Elfos, name: 'Tejedora', type: UnitType.Elite, strength: 3, movement: 2, range: 3, special: 'Protección contra rango.', cost: 5, imageUrl: 'https://picsum.photos/400/400?random=10' },
    // Orcos
    { id: 'o1', faction: Faction.Orcos, name: 'Goblins', type: UnitType.Ligera, strength: 3, movement: 3, range: 1, special: 'Enemigo no mueve (1 turno).', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=11' },
    { id: 'o2', faction: Faction.Orcos, name: 'Lanzadores', type: UnitType.Ligera, strength: 3, movement: 2, range: 2, special: 'Dados de Media en melé.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=12' },
    { id: 'o3', faction: Faction.Orcos, name: 'G. Orcos', type: UnitType.Media, strength: 4, movement: 2, range: 0, special: '"Casco": +1 daño y se cura 1.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=13' },
    { id: 'o4', faction: Faction.Orcos, name: 'J. Jabalí', type: UnitType.Pesada, strength: 3, movement: 3, range: 0, special: 'Si mata, avanza y ataca de nuevo.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=14' },
    { id: 'o5', faction: Faction.Orcos, name: 'Trol de Piedra', type: UnitType.Elite, strength: 4, movement: 1, range: 1, special: 'Recupera 1 F al inicio del turno.', cost: 5, imageUrl: 'https://picsum.photos/400/400?random=15' },
    // No Muertos
    { id: 'nm1', faction: Faction.NoMuertos, name: 'Esqueletos', type: UnitType.Ligera, strength: 4, movement: 1, range: 0, special: 'Inmune a Banderas.', cost: 5, imageUrl: 'https://picsum.photos/400/400?random=16' },
    { id: 'nm2', faction: Faction.NoMuertos, name: 'Zombis', type: UnitType.Media, strength: 4, movement: 1, range: 0, special: 'Si mata, crea Zombi F1 en hex.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=17' },
    { id: 'nm3', faction: Faction.NoMuertos, name: 'C. Negros', type: UnitType.Pesada, strength: 3, movement: 3, range: 0, special: 'Defensor tira -1 dado contraataque.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=18' },
    { id: 'nm4', faction: Faction.NoMuertos, name: 'Nigromante', type: UnitType.Elite, strength: 3, movement: 2, range: 2, special: 'Acción: Cura +1 a 3 aliados a R1.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=19' },
  ] as Unit[],
  CARDS: [
    { id: 'c1', category: 'Sección', name: 'Exploración', count: 6, effectA: '2 unidades en sección + Roba 2, descarta 1.', effectB: '1 unidad en cualquier sitio + Roba 1.', imageUrl: 'https://picsum.photos/300/400?random=20' },
    { id: 'c2', category: 'Sección', name: 'Ataque', count: 12, effectA: '3 unidades en sección.', effectB: '1 unidad en cualquier sitio.', imageUrl: 'https://picsum.photos/300/400?random=21' },
    { id: 'c3', category: 'Sección', name: 'Avance General', count: 6, effectA: '1 unidad en cada sección (I, C, D).', effectB: '2 unidades en una sección.', imageUrl: 'https://picsum.photos/300/400?random=22' },
    { id: 'c4', category: 'Táctica', name: 'Hostigamiento', count: 4, effectA: '4 Ligeras.', effectB: '2 Medias.', imageUrl: 'https://picsum.photos/300/400?random=23' },
    { id: 'c5', category: 'Táctica', name: 'Muro de Acero', count: 4, effectA: '3 Medias (+1 dado defensa).', effectB: '2 Pesadas.', imageUrl: 'https://picsum.photos/300/400?random=24' },
    { id: 'c6', category: 'Táctica', name: 'Carga de Caballería', count: 4, effectA: '3 Pesadas (Bono carga).', effectB: '1 Élite.', imageUrl: 'https://picsum.photos/300/400?random=25' },
    { id: 'c7', category: 'Táctica', name: 'Orden del Rey', count: 4, effectA: '1 Élite (Mueve y ataca x2).', effectB: '2 unidades cualesquiera.', imageUrl: 'https://picsum.photos/300/400?random=26' },
    { id: 'c8', category: 'Hechizo', name: 'Bola de Fuego', count: 2, effectA: '(2 💧) Daño área R4.', effectB: 'Activa 1 Ligera.', imageUrl: 'https://picsum.photos/300/400?random=27' },
    { id: 'c9', category: 'Hechizo', name: 'Resurrección', count: 2, effectA: '(3 💧) Revive unidad F1.', effectB: 'Activa 1 Media.', imageUrl: 'https://picsum.photos/300/400?random=28' },
    { id: 'c10', category: 'Hechizo', name: 'Escudo Arcano', count: 2, effectA: '(1 💧) Cancela daño recibido.', effectB: 'Activa 1 unidad de Rango.', imageUrl: 'https://picsum.photos/300/400?random=29' },
    { id: 'c11', category: 'Hechizo', name: 'Teletransporte', count: 2, effectA: '(2 💧) Mueve unidad a cualquier hex.', effectB: 'Activa 1 Pesada.', imageUrl: 'https://picsum.photos/300/400?random=30' },
    { id: 'c12', category: 'Hechizo', name: 'Oleada de Maná', count: 2, effectA: 'Gana 3 💧.', effectB: 'Activa 1 Élite.', imageUrl: 'https://picsum.photos/300/400?random=31' },
  ] as Card[],
  TERRAIN: [
    { id: 't1', name: 'Bosque', effectMovement: 'Las unidades deben detenerse al entrar.', effectCombat: '-1 dado a los ataques que entran.', imageUrl: 'https://picsum.photos/400/300?random=32' },
    { id: 't2', name: 'Colina', effectMovement: 'Sin penalización.', effectCombat: 'Atacante desde abajo tira -1 dado. Linea de visión bloqueada por otras colinas.', imageUrl: 'https://picsum.photos/400/300?random=33' },
    { id: 't3', name: 'Río', effectMovement: 'Intransitable excepto en puentes.', effectCombat: 'Ataques desde río tienen -1 dado.', imageUrl: 'https://picsum.photos/400/300?random=34' },
    { id: 't4', name: 'Pueblo', effectMovement: 'Las unidades deben detenerse.', effectCombat: 'Inmune a la primera bandera.', imageUrl: 'https://picsum.photos/400/300?random=35' },
    { id: 't5', name: 'Altar Mágico', effectMovement: 'Terreno abierto.', effectCombat: 'Otorga +1 Maná (💧) al inicio del turno si se controla.', imageUrl: 'https://picsum.photos/400/300?random=36' },
  ] as Terrain[],
  SCENARIOS: [
    { id: 's1', name: 'Escaramuza Fronteriza', difficulty: 'Fácil', description: 'Dos patrullas se encuentran en la linde del bosque. Ideal para aprender las mecánicas básicas.', setup: 'Mapa estándar. 30 Oro por bando. Sin Élite.', imageUrl: 'https://picsum.photos/600/400?random=37' },
    { id: 's2', name: 'La Defensa del Paso', difficulty: 'Media', description: 'Un ejército intenta cruzar un río defendido por una fuerza menor pero atrincherada.', setup: 'Jugador A (Defensor) despliega primero. Río cruzando el centro.', imageUrl: 'https://picsum.photos/600/400?random=38' },
    { id: 's3', name: 'Asalto al Altar', difficulty: 'Difícil', description: 'Carrera por controlar el Altar central que emana gran poder mágico.', setup: 'Altar en el hex central. Gana quien lo controle 3 turnos seguidos.', imageUrl: 'https://picsum.photos/600/400?random=39' },
  ] as Scenario[]
};

const DATA_EN = {
  UNITS: [
    // Humans
    { id: 'h1', faction: Faction.Humanos, name: 'Spear Levies', type: UnitType.Ligera, strength: 3, movement: 2, range: 0, special: '+1 defense die adjacent to ally.', cost: 2, imageUrl: 'https://picsum.photos/400/400?random=1' },
    { id: 'h2', faction: Faction.Humanos, name: 'Crossbowmen', type: UnitType.Ligera, strength: 3, movement: 1, range: 3, special: 'Ignores terrain bonuses.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=2' },
    { id: 'h3', faction: Faction.Humanos, name: 'Swordsmen', type: UnitType.Media, strength: 4, movement: 1, range: 0, special: 'Ignores 1 flag.', cost: 3, imageUrl: 'https://picsum.photos/400/400?random=3' },
    { id: 'h4', faction: Faction.Humanos, name: 'Knights', type: UnitType.Pesada, strength: 4, movement: 3, range: 0, special: 'Charge Bonus.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=4' },
    { id: 'h5', faction: Faction.Humanos, name: 'War Altar', type: UnitType.Elite, strength: 4, movement: 1, range: 0, special: 'Aura: Reroll 1 failed die at R1.', cost: 5, imageUrl: 'https://picsum.photos/400/400?random=5' },
    // Elves
    { id: 'e1', faction: Faction.Elfos, name: 'Trackers', type: UnitType.Ligera, strength: 3, movement: 3, range: 0, special: 'Moves 1 hex after attack.', cost: 3, imageUrl: 'https://picsum.photos/400/400?random=6' },
    { id: 'e2', faction: Faction.Elfos, name: 'Elite Archers', type: UnitType.Ligera, strength: 3, movement: 2, range: 4, special: 'Attacks x2 if not moved.', cost: 5, imageUrl: 'https://picsum.photos/400/400?random=7' },
    { id: 'e3', faction: Faction.Elfos, name: 'Silver Guard', type: UnitType.Media, strength: 4, movement: 2, range: 0, special: 'Does not stop in forests.', cost: 3, imageUrl: 'https://picsum.photos/400/400?random=8' },
    { id: 'e4', faction: Faction.Elfos, name: 'Stag Riders', type: UnitType.Pesada, strength: 3, movement: 4, range: 0, special: 'Retreats before taking damage.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=9' },
    { id: 'e5', faction: Faction.Elfos, name: 'Weaver', type: UnitType.Elite, strength: 3, movement: 2, range: 3, special: 'Protection against ranged.', cost: 5, imageUrl: 'https://picsum.photos/400/400?random=10' },
    // Orcs
    { id: 'o1', faction: Faction.Orcos, name: 'Goblins', type: UnitType.Ligera, strength: 3, movement: 3, range: 1, special: 'Enemy cannot move (1 turn).', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=11' },
    { id: 'o2', faction: Faction.Orcos, name: 'Spear Throwers', type: UnitType.Ligera, strength: 3, movement: 2, range: 2, special: 'Medium dice in melee.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=12' },
    { id: 'o3', faction: Faction.Orcos, name: 'Orc Warriors', type: UnitType.Media, strength: 4, movement: 2, range: 0, special: '"Helm": +1 damage and heals 1.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=13' },
    { id: 'o4', faction: Faction.Orcos, name: 'Boar Riders', type: UnitType.Pesada, strength: 3, movement: 3, range: 0, special: 'If kills, advances and attacks again.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=14' },
    { id: 'o5', faction: Faction.Orcos, name: 'Stone Troll', type: UnitType.Elite, strength: 4, movement: 1, range: 1, special: 'Regenerates 1 Str at start of turn.', cost: 5, imageUrl: 'https://picsum.photos/400/400?random=15' },
    // Undead
    { id: 'nm1', faction: Faction.NoMuertos, name: 'Skeletons', type: UnitType.Ligera, strength: 4, movement: 1, range: 0, special: 'Immune to Flags.', cost: 5, imageUrl: 'https://picsum.photos/400/400?random=16' },
    { id: 'nm2', faction: Faction.NoMuertos, name: 'Zombies', type: UnitType.Media, strength: 4, movement: 1, range: 0, special: 'If kills, creates Str 1 Zombie in hex.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=17' },
    { id: 'nm3', faction: Faction.NoMuertos, name: 'Black Knights', type: UnitType.Pesada, strength: 3, movement: 3, range: 0, special: 'Defender rolls -1 die counter-attack.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=18' },
    { id: 'nm4', faction: Faction.NoMuertos, name: 'Necromancer', type: UnitType.Elite, strength: 3, movement: 2, range: 2, special: 'Action: Heals +1 to 3 allies at R1.', cost: 4, imageUrl: 'https://picsum.photos/400/400?random=19' },
  ] as Unit[],
  CARDS: [
    { id: 'c1', category: 'Sección', name: 'Reconnaissance', count: 6, effectA: '2 units in section + Draw 2, discard 1.', effectB: '1 unit anywhere + Draw 1.', imageUrl: 'https://picsum.photos/300/400?random=20' },
    { id: 'c2', category: 'Sección', name: 'Attack', count: 12, effectA: '3 units in section.', effectB: '1 unit anywhere.', imageUrl: 'https://picsum.photos/300/400?random=21' },
    { id: 'c3', category: 'Sección', name: 'General Advance', count: 6, effectA: '1 unit in each section (L, C, R).', effectB: '2 units in one section.', imageUrl: 'https://picsum.photos/300/400?random=22' },
    { id: 'c4', category: 'Táctica', name: 'Harassment', count: 4, effectA: '4 Light units.', effectB: '2 Medium units.', imageUrl: 'https://picsum.photos/300/400?random=23' },
    { id: 'c5', category: 'Táctica', name: 'Wall of Steel', count: 4, effectA: '3 Medium units (+1 defense die).', effectB: '2 Heavy units.', imageUrl: 'https://picsum.photos/300/400?random=24' },
    { id: 'c6', category: 'Táctica', name: 'Cavalry Charge', count: 4, effectA: '3 Heavy units (Charge Bonus).', effectB: '1 Elite unit.', imageUrl: 'https://picsum.photos/300/400?random=25' },
    { id: 'c7', category: 'Táctica', name: 'King\'s Order', count: 4, effectA: '1 Elite unit (Move and attack x2).', effectB: '2 units anywhere.', imageUrl: 'https://picsum.photos/300/400?random=26' },
    { id: 'c8', category: 'Hechizo', name: 'Fireball', count: 2, effectA: '(2 💧) Area Damage R4.', effectB: 'Activate 1 Light unit.', imageUrl: 'https://picsum.photos/300/400?random=27' },
    { id: 'c9', category: 'Hechizo', name: 'Resurrection', count: 2, effectA: '(3 💧) Revive unit Str 1.', effectB: 'Activate 1 Medium unit.', imageUrl: 'https://picsum.photos/300/400?random=28' },
    { id: 'c10', category: 'Hechizo', name: 'Arcane Shield', count: 2, effectA: '(1 💧) Cancel received damage.', effectB: 'Activate 1 Ranged unit.', imageUrl: 'https://picsum.photos/300/400?random=29' },
    { id: 'c11', category: 'Hechizo', name: 'Teleport', count: 2, effectA: '(2 💧) Move unit to any hex.', effectB: 'Activate 1 Heavy unit.', imageUrl: 'https://picsum.photos/300/400?random=30' },
    { id: 'c12', category: 'Hechizo', name: 'Mana Surge', count: 2, effectA: 'Gain 3 💧.', effectB: 'Activate 1 Elite unit.', imageUrl: 'https://picsum.photos/300/400?random=31' },
  ] as Card[],
  TERRAIN: [
    { id: 't1', name: 'Forest', effectMovement: 'Units must stop when entering.', effectCombat: '-1 die to attacks entering forest.', imageUrl: 'https://picsum.photos/400/300?random=32' },
    { id: 't2', name: 'Hill', effectMovement: 'No penalty.', effectCombat: 'Attacker from below rolls -1 die. LOS blocked by other hills.', imageUrl: 'https://picsum.photos/400/300?random=33' },
    { id: 't3', name: 'River', effectMovement: 'Impassable except at bridges.', effectCombat: 'Attacks from river have -1 die.', imageUrl: 'https://picsum.photos/400/300?random=34' },
    { id: 't4', name: 'Village', effectMovement: 'Units must stop.', effectCombat: 'Immune to the first Flag.', imageUrl: 'https://picsum.photos/400/300?random=35' },
    { id: 't5', name: 'Magic Altar', effectMovement: 'Open terrain.', effectCombat: 'Grants +1 Mana (💧) at start of turn if controlled.', imageUrl: 'https://picsum.photos/400/300?random=36' },
  ] as Terrain[],
  SCENARIOS: [
    { id: 's1', name: 'Border Skirmish', difficulty: 'Fácil', description: 'Two patrols meet at the edge of the forest. Ideal for learning basic mechanics.', setup: 'Standard map. 30 Gold per side. No Elite.', imageUrl: 'https://picsum.photos/600/400?random=37' },
    { id: 's2', name: 'Defense of the Pass', difficulty: 'Media', description: 'An army attempts to cross a river defended by a smaller but entrenched force.', setup: 'Player A (Defender) deploys first. River crossing the center.', imageUrl: 'https://picsum.photos/600/400?random=38' },
    { id: 's3', name: 'Assault on the Altar', difficulty: 'Difícil', description: 'Race to control the central Altar that emanates great magical power.', setup: 'Altar in the central hex. Win by controlling it for 3 consecutive turns.', imageUrl: 'https://picsum.photos/600/400?random=39' },
  ] as Scenario[]
};
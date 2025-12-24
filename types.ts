export enum Faction {
  Humanos = "Humanos",
  Elfos = "Elfos",
  Orcos = "Orcos",
  NoMuertos = "No Muertos",
  Neutral = "Neutral"
}

export enum UnitType {
  Ligera = "Ligera",
  Media = "Media",
  Pesada = "Pesada",
  Elite = "Élite"
}

export interface Unit {
  id: string;
  faction: Faction;
  name: string;
  type: UnitType;
  strength: number;
  movement: number;
  range: number;
  special: string;
  cost: number;
  imageUrl: string;
}

export interface Card {
  id: string;
  category: "Sección" | "Táctica" | "Hechizo";
  name: string;
  count: number;
  effectA: string;
  effectB: string;
  imageUrl: string;
}

export interface Terrain {
  id: string;
  name: string;
  effectMovement: string;
  effectCombat: string;
  imageUrl: string;
}

export interface Scenario {
  id: string;
  name: string;
  difficulty: "Fácil" | "Media" | "Difícil";
  description: string;
  setup: string;
  imageUrl: string;
}

export type ViewState = 'units' | 'cards' | 'terrain' | 'scenarios' | 'rules';
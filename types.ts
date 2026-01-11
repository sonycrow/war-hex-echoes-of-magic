export type LocalizedString = {
  es: string;
  en: string;
};

export type FactionCode =
  | "amazons"
  | "barbarians"
  | "daemons"
  | "dwarves"
  | "elves"
  | "orcs"
  | "undead"
  | "mercenaries"
  | "titans"
  | "inferno"
  | "neutral";

export type UnitType =
  | "light"
  | "medium"
  | "heavy"
  | "elite"
  | "structure";

export type UnitSubtype =
  | "unit"
  | "hero"
  | "titan";

export interface Unit {
  id: string;
  faction: FactionCode;
  name: LocalizedString;
  type: UnitType;
  subtype: UnitSubtype;
  expansion: string;
  strength: number;
  movement: number;
  range: number;
  rules: LocalizedString;
  cost: number | string;
  version?: number;
  date?: string;
}

export interface Card {
  id: string;
  type: string;
  name: LocalizedString;
  count: number;
  effectA: LocalizedString;
  effectB: LocalizedString;
  imageUrl: string;
}

export interface Terrain {
  id: string;
  name: LocalizedString;
  effectMovement: LocalizedString;
  effectCombat: LocalizedString;
  imageUrl: string;
}

export interface Scenario {
  id: string;
  name: LocalizedString;
  difficulty: LocalizedString;
  description: LocalizedString;
  setup: LocalizedString;
  imageUrl: string;
}

export type ViewState = 'units' | 'cards' | 'terrain' | 'scenarios' | 'rules' | 'stickers' | 'card-generator';
import json
import random
import argparse
import os
import math
from collections import defaultdict
from enum import Enum

# --- Constants & Enums ---

class UnitType(Enum):
    LIGHT = "light"
    MEDIUM = "medium"
    HEAVY = "heavy"
    ELITE = "elite" # For Heroes or special units

class DieFace(Enum):
    SWORD = "sword"   # 1
    FLAG = "flag"     # 2
    CIRCLE = "circle" # 3 (Light)
    TRIANGLE = "triangle" # 4 (Medium)
    SQUARE = "square" # 5 (Heavy)
    MAGIC = "magic"   # 6

# Probabilities are 1/6 for each face
DICE_FACES = [
    DieFace.SWORD, DieFace.FLAG, DieFace.CIRCLE,
    DieFace.TRIANGLE, DieFace.SQUARE, DieFace.MAGIC
]

SECTION_LEFT = "left"
SECTION_CENTER = "center"
SECTION_RIGHT = "right"
SECTIONS = [SECTION_LEFT, SECTION_CENTER, SECTION_RIGHT]

# --- Data Loading ---

def load_json(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

# --- Classes ---

class Unit:
    def __init__(self, data, faction_id):
        self.id = data['id']
        self.name_es = data['name']['es']
        self.faction = faction_id
        self.type = UnitType(data['type']) if data['type'] in [t.value for t in UnitType] else UnitType.MEDIUM
        # Default subtype to unit if missing
        self.subtype = data.get('subtype', 'unit')
        
        self.max_strength = data.get('strength', 4)
        self.current_strength = self.max_strength
        self.movement = data.get('movement', 2)
        self.range_val = data.get('range', 1)
        self.cost = data.get('cost', 0)
        
        self.is_hero = "Hero" in data.get('traits', []) # Inferred, might need better check from rules
        # Manual fix for heroes based on description/cost/stats if trait missing
        if self.cost >= 6 or self.subtype == 'hero':
             self.is_hero = True
             self.type = UnitType.ELITE # Heroes have elite defense usually

        self.section = None # location on board
        self.has_moved = False
        self.has_attacked = False

    def is_alive(self):
        return self.current_strength > 0

    def take_damage(self, hits):
        self.current_strength = max(0, self.current_strength - hits)

    def can_be_hit_by(self, face):
        if face == DieFace.SWORD: return True
        if self.type == UnitType.LIGHT and face in [DieFace.CIRCLE, DieFace.MAGIC]: return True
        if self.type == UnitType.MEDIUM and face == DieFace.TRIANGLE: return True
        if self.type == UnitType.HEAVY and face == DieFace.SQUARE: return True
        return False

class Player:
    def __init__(self, faction_code, faction_name, units_data, use_heroes=False):
        self.faction_code = faction_code
        self.faction_name = faction_name
        self.units = []
        self.mana = 0
        self.medals = 0
        self.hand = [] # Cards
        
        # Build Army
        faction_units_defs = [u for u in units_data if u['faction'] == faction_code and u['expansion'] == 'base']
        
        # Standard Units
        for u_def in faction_units_defs:
            count = 2 if u_def.get('cost', 0) < 4 else 1
            for _ in range(count):
                self.units.append(Unit(u_def, faction_code))

        # Hero Addition
        if use_heroes:
            # Find hero for this faction
            hero_def = next((u for u in units_data if u['faction'] == faction_code and u.get('subtype') == 'hero'), None)
            if hero_def:
                self.units.append(Unit(hero_def, faction_code))
                
        # Initial positioning (Abstracted)
        # Distribute evenly across sections
        for i, u in enumerate(self.units):
            u.section = SECTIONS[i % 3]

    def get_alive_units(self):
        return [u for u in self.units if u.is_alive()]

class Game:
    def __init__(self, faction1_def, faction2_def, units_data, cards_data, use_heroes=False):
        self.p1 = Player(faction1_def['code'], faction1_def['name']['es'], units_data, use_heroes)
        self.p2 = Player(faction2_def['code'], faction2_def['name']['es'], units_data, use_heroes)
        self.cards_data = cards_data
        self.turn_count = 0
        self.max_turns = 200 # Increased from 50
        self.log = []
        self.verbose = False # Toggle via arg pass later or just hack it

    def log_event(self, msg):
        self.log.append(msg)
        if self.verbose: print(msg)

    def roll_dice(self, count):
        return [random.choice(DICE_FACES) for _ in range(count)]

    def resolve_combat(self, attacker, defender, range_combat=False, distance=1):
        dice_count = attacker.current_strength
        if range_combat:
            # Rule Update: Flat -1 if not adjacent (distance > 1), minimum 1 die.
            if distance > 1:
                dice_count = max(1, dice_count - 1)
        
        rolls = self.roll_dice(dice_count)
        hits = 0
        flags = 0
        
        for face in rolls:
            if defender.can_be_hit_by(face):
                hits += 1
            elif face == DieFace.FLAG:
                flags += 1
            elif face == DieFace.MAGIC:
                # Simple logic: If magic didn't hit (not light), attacker gains mana
                # Not fully implementing attacker.owner.mana += 1 logic complexity here primarily for stats
                pass

        # Damage
        defender.take_damage(hits)
        
        # Report
        return hits, flags

    def play_turn(self, player, opponent):
        # 1. Gain Mana
        player.mana += 1 # Base generation
        
        # 2. Card Phase (Abstracted)
        # Assume player draws a card that activates units in a section with most units
        # Simple AI: activating section with most ready units
        
        section_counts = defaultdict(int)
        for u in player.get_alive_units():
            section_counts[u.section] += 1
        
        if not section_counts:
            return # No units left
            
        best_section = max(section_counts, key=section_counts.get)
        active_units = [u for u in player.get_alive_units() if u.section == best_section]
        
        # Limit to 3 activations (standard card avg)
        active_units = active_units[:3]
        
        # 3. Action Phase for activated units
        for unit in active_units:
            # Move towards enemy? (Abstracted: Distance closing)
            # In this abstract sim, we just check if can attack
            
            # Find target in same section
            enemies = [e for e in opponent.get_alive_units() if e.section == unit.section]
            
            if not enemies:
                # No enemies in this section! Move to a section with enemies.
                enemy_sections = list(set(e.section for e in opponent.get_alive_units()))
                if enemy_sections:
                    # Move to random populated section
                    # self.log_event(f"{unit.name_es} moves from {unit.section} to {enemy_sections[0]}")
                    unit.section = random.choice(enemy_sections)
                    # End activation (Move action consumes turn usually unless special)
                    continue
            
            if enemies:
                target = random.choice(enemies) # Random target in lane
                
                # Check range
                dist = 1 # melee
                # If ranged, maybe distance is greater?
                # For simplicity in this purely statistical stat-vs-stat sim, we assume melee clash eventually.
                # Ranged units get a "free shot" round before melee?
                # Let's simplify:
                # If unit range > 1, it attacks with range rules.
                # If unit range == 1, it attacks with melee rules.
                
                is_ranged = unit.range_val > 1
                hits, flags = self.resolve_combat(unit, target, range_combat=is_ranged, distance=(2 if is_ranged else 1))
                
                if hits > 0:
                    self.log_event(f"{unit.name_es} hits {target.name_es} for {hits} dmg")
                
                if not target.is_alive():
                    self.log_event(f"{target.name_es} eliminated!")
                    player.medals += 1

    def run(self):
        while self.turn_count < self.max_turns:
            self.turn_count += 1
            
            # P1 Turn
            self.play_turn(self.p1, self.p2)
            if len(self.p2.get_alive_units()) == 0 or self.p1.medals >= 5: # Victory condition: 5 medals or wipe
                return self.p1.faction_code
                
            # P2 Turn
            self.play_turn(self.p2, self.p1)
            if len(self.p1.get_alive_units()) == 0 or self.p2.medals >= 5:
                return self.p2.faction_code
                
                return self.p2.faction_code
                
        if self.p1.medals > self.p2.medals:
            return self.p1.faction_code
        elif self.p2.medals > self.p1.medals:
            return self.p2.faction_code
        else:
            return "draw"

def run_simulations(n_games):
    data_dir = "d:/Devel/Proyectos/personal/war-hex-echoes-of-magic/data" # Adjust if needed
    units = load_json(os.path.join(data_dir, "units.json"))
    factions = load_json(os.path.join(data_dir, "factions.json"))
    cards = load_json(os.path.join(data_dir, "cards.json"))
    
    # Filter valid factions (exclude neutral/mercs/titans/inferno for now as per request)
    valid_factions = [f for f in factions if f['code'] not in ['neutral', 'mercenaries', 'titans', 'inferno']]
    
    results = defaultdict(lambda: defaultdict(int)) # results[f1][f2] = f1_wins
    
    # self.log_event("Starting Simulations...")
    
    pairs = []
    for i in range(len(valid_factions)):
        for j in range(i + 1, len(valid_factions)):
            pairs.append((valid_factions[i], valid_factions[j]))
            
    # Iterate all pairs
    # Force verbose for first game to debug
    first_run = True
    
    for f1, f2 in pairs:
        code1 = f1['code']
        code2 = f2['code']
        # print(f"Simulating {code1} vs {code2}...")
        
        for _ in range(n_games):
            # Run 2 games per pair to swap first player advantage if any (though simultaneous turns here)
            # Just plain loop
            g = Game(f1, f2, units, cards, use_heroes=args.heroes)
            if first_run:
                g.verbose = True
                g.log_event(f"--- Debug Game: {code1} vs {code2} ---")
                first_run = False
            
            winner = g.run()
            # print(f"Game {code1} vs {code2} -> Winner: {winner} (Turns: {g.turn_count})")
            
            if winner == code1:
                results[code1][code2] += 1
                results[code1]['total_wins'] += 1
                results[code1]['win_turns'] += g.turn_count
            elif winner == code2:
                results[code2][code1] += 1
                results[code2]['total_wins'] += 1
                results[code2]['win_turns'] += g.turn_count
            else:
                results[code1]['draws'] += 1
                results[code2]['draws'] += 1

    # Analysis Report
    print("# Informe de Balance y Simulación")
    print(f"Total de partidas por emparejamiento: {n_games}")
    print("\n## Resultados por Facción\n")
    
    sorted_factions = sorted(valid_factions, key=lambda x: results[x['code']]['total_wins'], reverse=True)
    
    for f in sorted_factions:
        code = f['code']
        name = f['name']['es']
        wins = results[code]['total_wins']
        draws = results[code]['draws'] # We were tracking draws but not printing them
        avg_turns = 0
        if wins > 0:
            avg_turns = results[code]['win_turns'] / wins
            
        print(f"### {name} ({code})")
        print(f"- Victorias Totales: {wins}")
        print(f"- Empates: {draws}")
        print(f"- Turnos Medios (Victoria): {avg_turns:.1f}")
        print("")
        # for f_opp in valid_factions:
        #    if f_opp == f: continue
        #    opp_code = f_opp['code']
        #    # wins_vs = results[code].get(opp_code, 0)
        #    # print(f"  vs {opp_code}: {wins_vs}") 
        print("")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--games", type=int, default=100, help="Number of games per matchup")
    parser.add_argument("--heroes", action="store_true", help="Include heroes in armies")
    args = parser.parse_args()
    
    run_simulations(args.games)

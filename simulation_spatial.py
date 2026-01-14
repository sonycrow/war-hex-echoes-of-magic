import json
import random
import argparse
import os
import math
from collections import defaultdict
from enum import Enum

# --- Constants & Enums ---

GRID_COLS = 13
GRID_ROWS = 9

class UnitType(Enum):
    LIGHT = "light"
    MEDIUM = "medium"
    HEAVY = "heavy"
    ELITE = "elite"

class DieFace(Enum):
    SWORD = "sword"   # 1
    FLAG = "flag"     # 2
    CIRCLE = "circle" # 3 (Light)
    TRIANGLE = "triangle" # 4 (Medium)
    SQUARE = "square" # 5 (Heavy)
    MAGIC = "magic"   # 6

DICE_FACES = [
    DieFace.SWORD, DieFace.FLAG, DieFace.CIRCLE,
    DieFace.TRIANGLE, DieFace.SQUARE, DieFace.MAGIC
]

SECTION_LEFT = "left"
SECTION_CENTER = "center"
SECTION_RIGHT = "right"

# --- Hex Logic (Offset Coordinates: Odd-r layout usually for C&C or generic) ---
# Actually, standard visual is stagger. Let's assume "Odd-r" (shoves odd rows right).
# Distance using Cube Coordinates.

def offset_to_cube(col, row):
    # odd-r conversion
    x = col - (row - (row & 1)) // 2
    z = row
    y = -x - z
    return (x, y, z)

def hex_distance(a, b):
    # a, b are (col, row) tuples
    ac = offset_to_cube(*a)
    bc = offset_to_cube(*b)
    return max(abs(ac[0] - bc[0]), abs(ac[1] - bc[1]), abs(ac[2] - bc[2]))

def get_section(col):
    if col <= 3: return SECTION_LEFT
    if col >= 9: return SECTION_RIGHT
    return SECTION_CENTER

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
        self.subtype = data.get('subtype', 'unit')
        
        self.max_strength = data.get('strength', 4)
        self.current_strength = self.max_strength
        self.movement = data.get('movement', 2)
        self.range_val = data.get('range', 1)
        self.cost = data.get('cost', 0)
        
        self.is_hero = "Hero" in data.get('traits', []) or self.cost >= 6 or self.subtype == 'hero'
        if self.is_hero: self.type = UnitType.ELITE

        self.pos = None # (col, row)
        self.owner = None # 1 or 2
    
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

class Game:
    def __init__(self, faction1_def, faction2_def, units_data, cards_data, use_heroes=False):
        self.units = [] # All units in a flat list
        self.cards_data = cards_data
        self.turn_count = 0
        self.max_turns = 200
        self.verbose = False
        
        self.p1_faction = faction1_def['code']
        self.p1_medals = 0
        self.p2_faction = faction2_def['code']
        self.p2_medals = 0
        
        # Setup Armies
        self._setup_player(1, self.p1_faction, units_data, use_heroes)
        self._setup_player(2, self.p2_faction, units_data, use_heroes)

    def _setup_player(self, player_num, faction_code, units_data, use_heroes):
        faction_units_defs = [u for u in units_data if u['faction'] == faction_code and u['expansion'] == 'base']
        
        my_units = []
        for u_def in faction_units_defs:
            count = 2 if u_def.get('cost', 0) < 4 else 1
            for _ in range(count):
                u = Unit(u_def, faction_code)
                u.owner = player_num
                my_units.append(u)
        
        # Add Hero
        if use_heroes:
            hero_def = next((u for u in units_data if u['faction'] == faction_code and u.get('subtype') == 'hero'), None)
            if hero_def:
                u = Unit(hero_def, faction_code)
                u.owner = player_num
                my_units.append(u)
        
        # Deployment (Fill rows 0,1 for P1; 8,7 for P2)
        base_row = 0 if player_num == 1 else 8
        second_row = 1 if player_num == 1 else 7
        
        # Shuffle for random deployment
        random.shuffle(my_units)
        
        possible_pos = []
        for c in range(GRID_COLS): possible_pos.append((c, base_row))
        for c in range(GRID_COLS): possible_pos.append((c, second_row))
        
        for i, u in enumerate(my_units):
            if i < len(possible_pos):
                u.pos = possible_pos[i]
                self.units.append(u)

    def get_alive_units(self, owner_filter=None):
        return [u for u in self.units if u.is_alive() and (owner_filter is None or u.owner == owner_filter)]

    def roll_dice(self, count):
        return [random.choice(DICE_FACES) for _ in range(count)]

    def resolve_combat(self, attacker, defender):
        dist = hex_distance(attacker.pos, defender.pos)
        
        # Validate Range
        if dist > attacker.range_val:
            return 0, 0 # Can't hit
            
        dice_count = attacker.current_strength
        
        # Ranged Penalty (New Rule: -1 if not adjacent)
        if dist > 1:
            dice_count = max(1, dice_count - 1)
            
        rolls = self.roll_dice(dice_count)
        hits = 0
        flags = 0
        
        for face in rolls:
            if defender.can_be_hit_by(face): hits += 1
            elif face == DieFace.FLAG: flags += 1
            
        defender.take_damage(hits)
        return hits, flags

    def get_closest_enemy(self, unit):
        enemies = self.get_alive_units(owner_filter=3-unit.owner)
        if not enemies: return None, 999
        
        best = None
        min_dist = 999
        for e in enemies:
            d = hex_distance(unit.pos, e.pos)
            if d < min_dist:
                min_dist = d
                best = e
        return best, min_dist

    def move_unit_towards(self, unit, target_pos):
        # Move 1 hex at a time towards target until movement exhausted
        current = unit.pos
        moves_left = unit.movement
        
        while moves_left > 0:
            # Get neighbors
            # Odd-r offset neighbors logic
            col, row = current
            is_odd = (row % 2) != 0
            
            # offsets for odd-r
            even_offsets = [(1,0), (1,-1), (0,-1), (-1,0), (0,1), (1,1)]
            odd_offsets = [(1,0), (0,-1), (-1,-1), (-1,0), (-1,1), (0,1)]
            offsets = odd_offsets if is_odd else even_offsets
            
            best_next = None
            best_dist = hex_distance(current, target_pos)
            
            for dx, dy in offsets:
                nx, ny = col + dx, row + dy
                # Check bounds
                if 0 <= nx < GRID_COLS and 0 <= ny < GRID_ROWS:
                    # Check occupancy
                    occupied = any(u.pos == (nx, ny) and u.is_alive() for u in self.units)
                    if not occupied:
                        d = hex_distance((nx, ny), target_pos)
                        if d < best_dist:
                            best_dist = d
                            best_next = (nx, ny)
            
            if best_next:
                current = best_next
                moves_left -= 1
                # If reached target (collision), stop - logic handled by occupancy check implies we stop adjacent
            else:
                break # Blocked
                
        unit.pos = current

    def play_turn(self, player_num):
        units = self.get_alive_units(player_num)
        if not units: return
        
        # Card Phase (Abstract): Pick section with most units and enemies nearby?
        # Simplified: Activate 3 random units that have valid targets or need to move
        
        # Prioritize units that CAN attack
        can_attack = []
        needs_move = []
        
        for u in units:
            target, dist = self.get_closest_enemy(u)
            if target:
                if dist <= u.range_val:
                    can_attack.append(u)
                else:
                    needs_move.append(u)
        
        # Select 3 activations
        activations = []
        quota = 3
        
        random.shuffle(can_attack)
        random.shuffle(needs_move)
        
        while quota > 0 and (can_attack or needs_move):
            if can_attack:
                activations.append(can_attack.pop(0))
            elif needs_move:
                activations.append(needs_move.pop(0))
            quota -= 1
            
        # Execute Actions
        for u in activations:
            target, dist = self.get_closest_enemy(u)
            if not target: continue
            
            # Move if needed
            if dist > u.range_val:
                self.move_unit_towards(u, target.pos)
                # Recalculate dist after move
                target, dist = self.get_closest_enemy(u) # Re-evaluate nearest? Or stick to target
                # Check if now in range
                if target and hex_distance(u.pos, target.pos) <= u.range_val:
                     hits, flags = self.resolve_combat(u, target)
                     if hits > 0 and self.verbose:
                         print(f"P{player_num} {u.name_es} hits {target.name_es} ({hits} dmg)")
                     if not target.is_alive():
                         if player_num == 1: self.p1_medals += 1
                         else: self.p2_medals += 1

            # Attack if already in range (and didn't just dash-melee unless allowed? Assume Move+Attack standard)
            elif dist <= u.range_val:
                 hits, flags = self.resolve_combat(u, target)
                 if hits > 0 and self.verbose:
                     print(f"P{player_num} {u.name_es} fires at {target.name_es} ({hits} dmg)")
                 if not target.is_alive():
                     if player_num == 1: self.p1_medals += 1
                     else: self.p2_medals += 1

    def run(self):
        while self.turn_count < self.max_turns:
            self.turn_count += 1
            
            self.play_turn(1)
            if len(self.get_alive_units(2)) == 0 or self.p1_medals >= 5: return self.p1_faction
            
            self.play_turn(2)
            if len(self.get_alive_units(1)) == 0 or self.p2_medals >= 5: return self.p2_faction
            
        return "draw" if self.p1_medals == self.p2_medals else (self.p1_faction if self.p1_medals > self.p2_medals else self.p2_faction)

def run_simulations(n_games, use_heroes):
    data_dir = "d:/Devel/Proyectos/personal/war-hex-echoes-of-magic/data"
    units = load_json(os.path.join(data_dir, "units.json"))
    factions = load_json(os.path.join(data_dir, "factions.json"))
    cards = load_json(os.path.join(data_dir, "cards.json"))
    
    valid_factions = [f for f in factions if f['code'] not in ['neutral', 'mercenaries', 'titans', 'inferno']]
    results = defaultdict(lambda: defaultdict(int))
    
    pairs = []
    for i in range(len(valid_factions)):
        for j in range(i + 1, len(valid_factions)):
            pairs.append((valid_factions[i], valid_factions[j]))
            
    print(f"Running Spatial Simulation (13x9 Grid)... Games per match: {n_games}")
    
    for f1, f2 in pairs:
        for _ in range(n_games):
            g = Game(f1, f2, units, cards, use_heroes)
            winner = g.run()
            
            if winner == f1['code']:
                results[f1['code']]['wins'] += 1
                results[f1['code']]['turns'] += g.turn_count
            elif winner == f2['code']:
                results[f2['code']]['wins'] += 1
                results[f2['code']]['turns'] += g.turn_count
            else:
                results[f1['code']]['draws'] += 1
                results[f2['code']]['draws'] += 1

    # Report
    print(f"\n# Spatial Results (With Heroes: {use_heroes})")
    rank = sorted(valid_factions, key=lambda x: results[x['code']]['wins'], reverse=True)
    for f in rank:
        code = f['code']
        wins = results[code]['wins']
        avg_turns = results[code]['turns'] / wins if wins > 0 else 0
        print(f"{f['name']['es']}: {wins} Wins | Avg Turns: {avg_turns:.1f}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--games", type=int, default=100)
    parser.add_argument("--heroes", action="store_true")
    args = parser.parse_args()
    run_simulations(args.games, args.heroes)

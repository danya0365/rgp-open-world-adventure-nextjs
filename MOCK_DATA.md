# 📦 Mock Data Documentation

## Overview
Complete mock data structure for RPG Open World Adventure game with hierarchical world map system.

---

## 🗺️ Hierarchical World Map Structure

### Location Hierarchy (Unlimited Nesting)
```
World → Continent → Region → Area → City → Building → Floor → Room
```

### Example Structure:
```
Aethoria (World)
├── Northern Continent
│   └── Frostpeak Mountains (Region)
│       └── Crystal Valley (Area)
│           ├── Silverhold (City)
│           │   ├── Adventurer's Guild Hall (Building)
│           │   │   ├── 1st Floor - Lobby
│           │   │   └── 2nd Floor - Meeting Rooms
│           │   │       ├── Guild Master's Office (Room)
│           │   │       └── Meeting Room A (Room)
│           │   └── ...
│           └── Frozen Depths (Dungeon)
└── Eastern Continent
    └── Elven Forest (Region)
        └── Elvenheim (City)
            └── Magic Tower (Building)
                └── 1st Floor - Library
```

### Location Types
- `world` - Top level world
- `continent` - Major landmass
- `region` - Geographic region
- `area` - Specific area
- `city` / `town` / `village` - Settlements
- `building` / `tower` / `castle` / `temple` - Structures
- `floor` - Building levels
- `room` - Individual rooms
- `dungeon` / `cave` / `forest` - Special locations

### Key Features
- **Unlimited Nesting**: Any location can have children
- **Path Tracking**: Full path array for breadcrumb navigation
- **Connections**: Doors, stairs, portals between locations
- **Discovery System**: Fog of war and location discovery
- **Fast Travel**: Designated fast travel points
- **Requirements**: Level and quest requirements for access

---

## 👥 Characters (8 Playable Characters)

### Available from Start
1. **อาเธอร์ (Arthur)** - Warrior (Fire)
2. **ลูน่า (Luna)** - Mage (Water, Light)
3. **เรเวน (Raven)** - Archer (Wind)

### Recruitable Characters
4. **ไคโร (Kiro)** - Assassin (Dark) - Quest: quest-005
5. **เซลีน่า (Selena)** - Paladin (Light) - Quest: quest-010
6. **เอเลน (Elena)** - Priest (Light) - Quest: quest-003
7. **ไคเดน (Kaiden)** - Monk (Earth) - Quest: quest-007
8. **มอร์แกน (Morgan)** - Necromancer (Dark) - Quest: quest-015

### Character Stats
- HP, MP, ATK, DEF, INT, AGI, LUK
- Elemental affinities (strengths/weaknesses)
- Equipment slots (weapon, armor, 2x accessory)
- Skill list
- Rarity (Common → Mythic)

---

## 👹 Enemies (20+ Monsters)

### Enemy Types
- **Normal**: Basic enemies (Level 1-10)
  - Ice Slime, Ice Wolf, Forest Goblin
- **Elite**: Stronger enemies (Level 15-25)
  - Frost Giant, Ice Golem
- **Boss**: Major bosses (Level 30-40)
  - Frost Dragon, Frozen Lich King
- **Legendary**: Ultimate bosses (Level 50+)
  - Ancient Ice God

### Enemy Features
- Elemental affinities
- Drop tables with chances
- EXP and Gold rewards
- Skills and abilities
- Weaknesses and resistances

---

## 🎒 Items (100+ Items)

### Item Categories

#### Weapons
- Swords, Bows, Staffs, Daggers, Axes, Spears, Wands
- ATK bonus, Critical rate/damage
- Elemental attributes
- Class requirements

#### Armor
- Heavy, Light, Robe, Shield
- DEF bonus
- Elemental resistances
- Stat bonuses

#### Consumables
- HP/MP Potions (Small, Medium, Large)
- Buff items (ATK, DEF, etc.)
- Elixir (full restore)

#### Materials
- Crafting materials
- Monster drops
- Stackable (up to 999)

#### Key Items
- Quest items
- Dungeon keys
- Non-stackable

### Rarity System
- Common (Gray)
- Uncommon (Green)
- Rare (Blue)
- Epic (Purple)
- Legendary (Gold)
- Mythic (Pink)

---

## ⚔️ Skills (50+ Skills)

### Skill Types
- **Attack**: Physical damage skills
- **Magic**: Magical damage/healing
- **Support**: Buffs and utility
- **Ultimate**: Powerful special moves
- **Passive**: Always-on effects

### Skill Features
- MP cost and cooldown
- Target types (single, area, all)
- Range and AOE shapes (line, cone, circle, cross)
- Elemental attributes
- Status effects (poison, burn, freeze, stun, etc.)
- Scaling (ATK, INT, DEF, HP)

### Combo Skills
- Multi-skill combinations
- Bonus effects when used in sequence

---

## 📜 Quests (30+ Quests)

### Quest Types

#### Main Quests
- Story progression
- Character recruitment
- Unlock new areas

#### Side Quests
- Optional character recruitment
- Extra rewards
- Lore and backstory

#### Event Quests
- Limited time events
- Special rewards
- Repeatable

#### Daily Quests
- Daily challenges
- Regular rewards

#### Bounty Quests
- Hunt specific enemies
- High rewards
- Repeatable

### Quest Features
- Multiple objectives (kill, collect, talk, explore, escort, defend)
- Level requirements
- Quest chains (required previous quest)
- Time limits (for events)
- Rewards (EXP, Gold, Items, Character unlocks)

---

## ⚔️ Battle Maps (Dynamic Tactical Grid)

### Map Sizes (Dragon Quest Tact Style)
- **Small**: 5x5 grid
- **Medium**: 7x7 grid
- **Large**: 9x9 grid
- **Boss**: 10x10+ grid

### Map Features

#### Terrain Types
- Grass, Water, Mountain, Ice, Lava, Poison
- Walkable/Non-walkable tiles
- Height variations (high ground advantage)

#### Tile Effects
- Damage tiles (lava, poison)
- Healing tiles
- Buff/Debuff tiles
- Elemental effects

#### Map Shapes
- **Rectangular**: Standard grid
- **Irregular**: Custom shapes with obstacles
- **Multi-level**: Different height levels

### Battle Mechanics
- Turn-based system
- Movement range per unit
- Attack range and AOE
- Flanking bonuses
- Height advantage
- Terrain effects
- Push/Pull mechanics

---

## 📊 Data Structure

### File Organization
```
/src/domain/types/
├── location.types.ts      # Location & map types
├── character.types.ts     # Character & enemy types
├── item.types.ts          # Item & equipment types
├── skill.types.ts         # Skill & ability types
├── quest.types.ts         # Quest types
└── battle.types.ts        # Battle & combat types

/src/data/mock/
├── locations.mock.ts      # 20+ locations with hierarchy
├── characters.mock.ts     # 8 playable characters
├── enemies.mock.ts        # 20+ enemies
├── items.mock.ts          # 100+ items
├── skills.mock.ts         # 50+ skills
├── quests.mock.ts         # 30+ quests
├── battles.mock.ts        # 7+ battle maps
└── index.ts               # Central export
```

---

## 🔧 Helper Functions

### Location Helpers
```typescript
buildLocationTree(locations)     // Build hierarchical tree
getLocationById(id)              // Get location by ID
getLocationChildren(parentId)    // Get child locations
getLocationPath(locationId)      // Get full path
```

### Character Helpers
```typescript
getCharacterById(id)
getPlayableCharacters()
getRecruitableCharacters()
getCharactersByClass(className)
```

### Enemy Helpers
```typescript
getEnemyById(id)
getEnemiesByType(type)
getEnemiesByLevel(min, max)
getBossEnemies()
```

### Item Helpers
```typescript
getItemById(id)
getItemsByType(type)
getItemsByRarity(rarity)
getWeapons() / getArmor() / getConsumables()
```

### Skill Helpers
```typescript
getSkillById(id)
getSkillsByType(type)
getSkillsByElement(element)
getUltimateSkills()
```

### Quest Helpers
```typescript
getQuestById(id)
getQuestsByType(type)
getAvailableQuests(playerLevel)
getMainQuests() / getSideQuests()
```

### Battle Helpers
```typescript
getBattleMapById(id)
getBattleMapsBySize(size)
getRandomBattleMap(size?)
```

---

## 🚀 Usage Examples

### Import Mock Data
```typescript
import {
  mockLocations,
  mockLocationTree,
  mockCharacters,
  mockEnemies,
  mockItems,
  mockSkills,
  mockQuests,
  mockBattleMaps
} from "@/src/data/mock";
```

### Use Helper Functions
```typescript
// Get location hierarchy
const worldTree = buildLocationTree(mockLocations);

// Get playable characters
const heroes = getPlayableCharacters();

// Get quests for level 10 player
const availableQuests = getAvailableQuests(10);

// Get random battle map
const battleMap = getRandomBattleMap("medium");
```

---

## 📝 Next Steps

1. ✅ Mock Data Complete
2. 🔄 Create UI Pages using mock data
3. 🔄 Implement World Map Navigation
4. 🔄 Build Combat System UI
5. 🔄 Character Management System
6. 🔄 Quest System UI
7. 🔄 Inventory System

---

## 🎮 Key Features Implemented

- ✅ Hierarchical World Map (unlimited nesting)
- ✅ 8 Playable Characters with unique classes
- ✅ 20+ Enemies (Normal, Elite, Boss, Legendary)
- ✅ 100+ Items (Weapons, Armor, Consumables, Materials)
- ✅ 50+ Skills with elemental system
- ✅ 30+ Quests (Main, Side, Event, Daily, Bounty)
- ✅ 7+ Dynamic Battle Maps (5x5 to 10x10+)
- ✅ Complete type definitions
- ✅ Helper functions for all data types

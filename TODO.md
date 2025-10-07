# RPG Open World Adventure - TODO List

## 📋 Project Overview
เกม RPG โลกเปิดกว้างแฟนตาซี พร้อมระบบต่อสู้แบบ Dynamic Tactical Grid (Dragon Quest Tact Style), เนื้อเรื่องหลัก Multiple Endings, เควสนับร้อย, และ Co-op Multiplayer

---

## 🎯 Phase 1: Foundation & Core Setup

### 1.1 Project Architecture
- [ ] Setup Next.js 15 with App Router
- [ ] Setup TypeScript
- [ ] Setup Tailwind CSS v4
- [ ] Setup Zustand for state management
- [ ] Setup localforage (Web) / MMKV (React Native) for persistence
- [ ] Setup axios for HTTP client
- [ ] Create Clean Architecture folder structure
  - [ ] `/src/domain` - Entities, Interfaces, Types
  - [ ] `/src/application` - Use Cases, Services
  - [ ] `/src/infrastructure` - API, Repositories
  - [ ] `/src/presentation` - Components, Presenters, Hooks

### 1.2 Design System
- [ ] Create fantasy RPG color palette
  - [ ] Primary (magic blue, gold, dark fantasy)
  - [ ] Element colors (Fire, Water, Earth, Wind, Light, Dark)
  - [ ] Status colors (HP, MP, Stamina)
- [ ] Setup typography with Kanit font
- [ ] Create component library
  - [ ] Buttons (primary, secondary, action)
  - [ ] Cards (character, item, quest)
  - [ ] Modals (inventory, menu, dialogue)
  - [ ] Forms (character creation, settings)
- [ ] Implement Dark Mode (default fantasy theme)
- [ ] Create responsive breakpoints (mobile-first)

### 1.3 Database & Backend
- [ ] Choose database (Supabase/PostgreSQL)
- [ ] Initialize Supabase project
- [ ] Design database schema
  - [ ] **Authentication & Profiles**
    - [ ] `auth.users` - Authentication
    - [ ] `public.profiles` - Player profiles
    - [ ] `public.characters` - Game characters (multiple per profile)
  - [ ] **World & Map Data (Hierarchical Structure)**
    - [ ] `locations` - Hierarchical location tree (unlimited nesting)
      - [ ] `id` - Unique identifier (UUID)
      - [ ] `parent_id` - Parent location (NULL for root/world)
      - [ ] `name` - Location name (e.g., "Aethoria", "Northern Continent", "Elven Forest")
      - [ ] `type` - Location type ENUM (world, continent, region, area, city, building, floor, room, dungeon, field)
      - [ ] `level` - Depth level (0 = world, 1 = continent, 2 = region, etc.)
      - [ ] `path` - Full path array (e.g., ["world", "continent", "region", "area"])
      - [ ] `slug` - URL-friendly identifier
      - [ ] `description` - Location description & lore
      - [ ] `coordinates` - X, Y position on parent map (JSONB)
      - [ ] `map_data` - Map configuration (JSONB: size, tiles, grid, boundaries)
      - [ ] `is_discoverable` - Can be discovered by player
      - [ ] `is_fast_travel_point` - Can be used for fast travel
      - [ ] `required_level` - Minimum level to access
      - [ ] `required_quest_id` - Quest needed to unlock (FK)
      - [ ] `weather_enabled` - Has dynamic weather
      - [ ] `time_enabled` - Has day/night cycle
      - [ ] `encounter_table_id` - Random encounter table (FK)
      - [ ] `background_music` - Audio file path
      - [ ] `ambient_sound` - Ambient sound file
      - [ ] `metadata` - Additional data (JSONB: NPCs, shops, services, exits)
      - [ ] `created_at`, `updated_at`
    - [ ] `location_connections` - Connections between locations
      - [ ] `from_location_id` - Source location (FK)
      - [ ] `to_location_id` - Destination location (FK)
      - [ ] `connection_type` - Type (entrance, exit, portal, stairs, ladder, door)
      - [ ] `is_locked` - Requires key/unlock
      - [ ] `required_item_id` - Item needed to unlock (FK)
      - [ ] `is_two_way` - Bidirectional connection
      - [ ] `coordinates` - Position on map (JSONB)
    - [ ] `player_location_discovery` - Player's discovered locations
      - [ ] `character_id` - Player character (FK)
      - [ ] `location_id` - Discovered location (FK)
      - [ ] `discovered_at` - Discovery timestamp
      - [ ] `completion_percentage` - Exploration progress (0-100)
      - [ ] `secrets_found` - Number of secrets found
    - [ ] `map_tiles` - Tile-based map data (optional, for grid-based maps)
      - [ ] `location_id` - Parent location (FK)
      - [ ] `x`, `y` - Tile coordinates
      - [ ] `tile_type` - Terrain type (grass, water, mountain, etc.)
      - [ ] `is_walkable` - Can player walk on this tile
      - [ ] `height` - Elevation (for height advantage in combat)
      - [ ] `tile_data` - Additional tile properties (JSONB)
    - [ ] `fog_of_war` - Player's revealed map areas
      - [ ] `character_id` - Player character (FK)
      - [ ] `location_id` - Map location (FK)
      - [ ] `revealed_tiles` - Array of revealed coordinates (JSONB)
    - [ ] Helper Functions & Views:
      - [ ] `get_location_hierarchy(location_id)` - Get full parent chain
      - [ ] `get_location_children(location_id)` - Get all child locations
      - [ ] `get_location_path(location_id)` - Get breadcrumb path
      - [ ] `get_accessible_locations(character_id)` - Get unlocked locations
      - [ ] `calculate_travel_distance(from_id, to_id)` - Calculate path distance
  - [ ] **Story & Quests**
    - [ ] `story_events` - Main story progression
    - [ ] `quests` - All quests (main, side, events)
    - [ ] `quest_progress` - Player quest status
    - [ ] `dialogue_choices` - Choices & consequences
  - [ ] **Combat System**
    - [ ] `battles` - Battle instances
    - [ ] `battle_units` - Units in battle (grid positions)
    - [ ] `combat_actions` - Turn history
    - [ ] `formations` - Pre-battle formations
  - [ ] **Characters & Party**
    - [ ] `party_members` - Available companions
    - [ ] `active_party` - Current party (max 4)
    - [ ] `character_stats` - Level, HP, MP, Stats
    - [ ] `character_skills` - Skills & abilities
    - [ ] `relationships` - Friendship & romance
  - [ ] **Items & Equipment**
    - [ ] `items` - Item database
    - [ ] `inventory` - Player inventory
    - [ ] `equipment` - Equipped items
    - [ ] `crafting_recipes` - Crafting system
  - [ ] **Progression**
    - [ ] `character_progression` - Levels, EXP
    - [ ] `skill_trees` - Skill unlocks
    - [ ] `achievements` - Achievement system
    - [ ] `bestiary` - Monster collection
  - [ ] **Multiplayer Co-op**
    - [ ] `co_op_sessions` - Active sessions
    - [ ] `session_participants` - Players in session
    - [ ] `shared_progress` - Shared quest progress
- [ ] Setup authentication (Supabase Auth + JWT)
- [ ] Create API endpoints structure
- [ ] Setup real-time subscriptions (Socket.io)

---

## 🎨 Phase 2: Core Game Systems (Mock Data First)

### 2.1 World Map & Navigation System
- [ ] **Open World Map** (`/game/world`)
  - [ ] Interactive world map (Canvas/Three.js)
  - [ ] Player position & movement
  - [ ] Fog of war system
  - [ ] Location markers (cities, dungeons, POI)
  - [ ] Fast travel system
  - [ ] Dynamic weather overlay
  - [ ] Day/night cycle visual
- [ ] **Location Detail** (`/game/location/[id]`)
  - [ ] Location info & description
  - [ ] Available NPCs & services
  - [ ] Quest markers
  - [ ] Shop/Inn/Guild access
  - [ ] Entry to dungeons/battles

### 2.2 Tactical Grid Combat System ⚔️ (Dragon Quest Tact Style)
- [ ] **Combat Arena** (`/game/battle/[id]`)
  - [ ] Dynamic Tactical Grid (Canvas/Phaser 3) - แต่ละ map มีขนาด grid ต่างกัน
  - [ ] Battle map configurations (small: 5x5, medium: 7x7, large: 9x9, boss: 10x10+)
  - [ ] Custom map shapes (rectangular, irregular, multi-level)
  - [ ] Unit positioning & placement
  - [ ] Movement range visualization
  - [ ] Attack range indicators
  - [ ] Turn-based system
  - [ ] Action queue UI
- [ ] **Combat Mechanics**
  - [ ] Movement system (range per unit)
  - [ ] Attack direction (front/back/side)
  - [ ] Flanking bonus system
  - [ ] High ground advantage
  - [ ] Terrain effects (water, fire, ice, lava, poison)
  - [ ] Terrain obstacles (rocks, walls, barriers)
  - [ ] Line of sight system
  - [ ] Push/Pull mechanics
- [ ] **Skills & Abilities**
  - [ ] Skill selection UI
  - [ ] AOE targeting (shapes: line, cone, circle)
  - [ ] Skill animations (Framer Motion)
  - [ ] Buff/Debuff indicators
  - [ ] Combo attack detection
  - [ ] Ultimate skill system
- [ ] **Formation System**
  - [ ] Pre-battle formation setup
  - [ ] Formation templates (offensive, defensive, balanced)
  - [ ] Save custom formations
- [ ] **Elemental System**
  - [ ] 6 elements (Fire, Water, Earth, Wind, Light, Dark)
  - [ ] Weakness/resistance chart
  - [ ] Elemental reactions
  - [ ] Visual element indicators

### 2.3 Story & Quest System
- [ ] **Story Event Viewer** (`/game/story/[id]`)
  - [ ] Cutscene display
  - [ ] Dialogue system with choices
  - [ ] Character portraits
  - [ ] Voice/text display
  - [ ] Background artwork
  - [ ] Story branching logic
- [ ] **Quest Log** (`/game/quests`)
  - [ ] Active quests list
  - [ ] Completed quests archive
  - [ ] Quest categories (Main, Side, Events)
  - [ ] Quest objectives tracker
  - [ ] Quest rewards preview
  - [ ] Map markers for quest locations
- [ ] **Quest Detail** (`/game/quest/[id]`)
  - [ ] Quest description & lore
  - [ ] Objectives checklist
  - [ ] NPC information
  - [ ] Recommended level
  - [ ] Rewards display
  - [ ] Track/untrack toggle

### 2.4 Character & Party Management
- [ ] **Party Screen** (`/game/party`)
  - [ ] Active party (4 members)
  - [ ] Available companions
  - [ ] Character stats display
  - [ ] Equipment preview
  - [ ] Switch party members
  - [ ] Relationship levels
- [ ] **Character Detail** (`/game/character/[id]`)
  - [ ] Character portrait & bio
  - [ ] Stats (HP, MP, STR, DEF, INT, AGI, LUK)
  - [ ] Skills & abilities list
  - [ ] Equipment slots (Weapon, Armor, Accessory x2)
  - [ ] Skill tree viewer
  - [ ] Relationship dialogue
- [ ] **Character Progression**
  - [ ] Level up screen
  - [ ] Stat allocation
  - [ ] Skill tree (unlock skills)
  - [ ] Class selection/Multi-class
  - [ ] Prestige class unlock

### 2.5 Inventory & Equipment System
- [ ] **Inventory Screen** (`/game/inventory`)
  - [ ] Grid-based inventory
  - [ ] Item categories (Weapons, Armor, Consumables, Materials, Key Items)
  - [ ] Item sorting & filtering
  - [ ] Item details popup
  - [ ] Use/Equip/Drop actions
  - [ ] Weight/capacity system
- [ ] **Equipment Screen** (`/game/equipment`)
  - [ ] Character paper doll
  - [ ] Equipment slots
  - [ ] Stat comparison
  - [ ] Set bonuses display
  - [ ] Transmog system
- [ ] **Crafting System** (`/game/crafting`)
  - [ ] Recipe list
  - [ ] Material requirements
  - [ ] Crafting success rate
  - [ ] Enchanting system
  - [ ] Upgrading system

### 2.6 Dungeon Exploration
- [ ] **Dungeon Map** (`/game/dungeon/[id]`)
  - [ ] Dungeon floor layout
  - [ ] Mini-map
  - [ ] Room exploration
  - [ ] Trap & puzzle indicators
  - [ ] Chest/treasure markers
  - [ ] Boss room marker
- [ ] **Dungeon Mechanics**
  - [ ] Procedural generation (optional)
  - [ ] Puzzle system
  - [ ] Trap mechanics
  - [ ] Secret room detection
  - [ ] Dungeon-specific mechanics

### 2.7 NPC & Town System
- [ ] **Town Hub** (`/game/town/[id]`)
  - [ ] Town map view
  - [ ] NPC locations
  - [ ] Building markers (Shop, Inn, Guild, Blacksmith)
  - [ ] Town events
- [ ] **NPC Interaction**
  - [ ] Dialogue system
  - [ ] NPC daily routines
  - [ ] Quest givers
  - [ ] Relationship building
  - [ ] Gift system
- [ ] **Shop System** (`/game/shop/[id]`)
  - [ ] Buy/Sell interface
  - [ ] Shop inventory (restocks)
  - [ ] Price fluctuation
  - [ ] Special deals
- [ ] **Services**
  - [ ] Inn (rest/save)
  - [ ] Blacksmith (upgrade/repair)
  - [ ] Guild Hall (bounties)
  - [ ] Tavern (rumors/info)

### 2.8 Dynamic World Systems
- [ ] **Weather System**
  - [ ] Weather types (Sunny, Rain, Snow, Storm, Fog)
  - [ ] Weather effects on gameplay
  - [ ] Visual weather overlay
  - [ ] Weather forecast
- [ ] **Day/Night Cycle**
  - [ ] Time progression
  - [ ] Visual lighting changes
  - [ ] NPC schedule changes
  - [ ] Monster spawn differences
  - [ ] Time-specific events

### 2.9 Mount & Transportation
- [ ] **Mount System** (`/game/mounts`)
  - [ ] Mount collection
  - [ ] Mount stats (speed, stamina)
  - [ ] Mount summoning
  - [ ] Mount customization
- [ ] **Fast Travel**
  - [ ] Unlock travel points
  - [ ] Travel cost system
  - [ ] Travel restrictions
- [ ] **Special Transport**
  - [ ] Airship system
  - [ ] Boat/ship system
  - [ ] Portal/teleport network

### 2.10 Treasure & Secrets
- [ ] **Treasure Hunting**
  - [ ] Treasure map system
  - [ ] Treasure chest interactions
  - [ ] Loot tables
  - [ ] Legendary item drops
- [ ] **Secrets & Easter Eggs**
  - [ ] Secret area detection
  - [ ] Hidden boss triggers
  - [ ] Easter egg collection
  - [ ] Lore book discoveries

---

## 🏆 Phase 3: Advanced Features

### 3.1 Achievement & Collection System
- [ ] **Achievements** (`/game/achievements`)
  - [ ] Achievement categories
  - [ ] Progress tracking
  - [ ] Reward unlocks
  - [ ] Achievement notifications
- [ ] **Bestiary** (`/game/bestiary`)
  - [ ] Monster encyclopedia
  - [ ] Monster stats & lore
  - [ ] Drop rates
  - [ ] Completion tracking
- [ ] **Codex** (`/game/codex`)
  - [ ] Item codex
  - [ ] Skill codex
  - [ ] Lore books
  - [ ] World history

### 3.2 Save System & Cloud Sync
- [ ] **Save Management** (`/game/save`)
  - [ ] Multiple save slots
  - [ ] Auto-save system
  - [ ] Manual save
  - [ ] Save info display
  - [ ] Load/Delete saves
- [ ] **Cloud Sync**
  - [ ] Supabase sync
  - [ ] Conflict resolution
  - [ ] Cross-device play
- [ ] **New Game+**
  - [ ] Carry over items/stats
  - [ ] Increased difficulty
  - [ ] New content unlocks

### 3.3 Multiplayer Co-op Mode 🤝
- [ ] **Lobby System** (`/game/multiplayer`)
  - [ ] Create session
  - [ ] Join session (code)
  - [ ] Session browser
  - [ ] Player ready status
- [ ] **Co-op Gameplay**
  - [ ] Synchronized combat (Socket.io)
  - [ ] Shared quest progress
  - [ ] Item trading
  - [ ] Party chat
  - [ ] Host migration
- [ ] **Co-op Specific**
  - [ ] Roles (Leader, Support)
  - [ ] Shared loot distribution
  - [ ] Co-op exclusive quests
  - [ ] Friendship bonuses

### 3.4 Mod Support & Custom Content
- [ ] **Mod Manager** (`/game/mods`)
  - [ ] Mod list
  - [ ] Enable/disable mods
  - [ ] Mod compatibility check
  - [ ] Load order management
- [ ] **Content Creator Tools**
  - [ ] Quest editor
  - [ ] Character creator
  - [ ] Item editor
  - [ ] Map editor
  - [ ] Export/import system
- [ ] **Community Hub**
  - [ ] Mod sharing
  - [ ] Rating system
  - [ ] Comments & feedback
  - [ ] Featured mods

### 3.5 Graphics & Audio
- [ ] **Visual Systems**
  - [ ] Three.js/React Three Fiber setup
  - [ ] Phaser 3 integration
  - [ ] Particle effects
  - [ ] Animation system (Framer Motion)
  - [ ] UI transitions
- [ ] **Audio System** (Howler.js)
  - [ ] Background music (per area)
  - [ ] Sound effects
  - [ ] Voice acting (optional)
  - [ ] Audio mixing
  - [ ] Volume controls

### 3.6 Accessibility Features
- [ ] **Difficulty Settings**
  - [ ] Easy/Normal/Hard modes
  - [ ] Custom difficulty
  - [ ] Battle speed adjustment
  - [ ] Enemy scaling
- [ ] **Accessibility Options**
  - [ ] Colorblind mode
  - [ ] Text-to-speech
  - [ ] Font size options
  - [ ] Subtitle options
  - [ ] Control remapping
- [ ] **Tutorial System**
  - [ ] Interactive tutorials
  - [ ] Tooltip system
  - [ ] Help menu
  - [ ] Tutorial replay

---

## 🎨 Phase 4: UI/UX Development

### 4.1 Main Menu & HUD
- [ ] **Main Menu** (`/`)
  - [ ] Title screen
  - [ ] New Game
  - [ ] Continue
  - [ ] Load Game
  - [ ] Settings
  - [ ] Credits
- [ ] **Game HUD**
  - [ ] HP/MP bars
  - [ ] Mini-map
  - [ ] Quest tracker
  - [ ] Quick item slots
  - [ ] Menu button

### 4.2 Component Library
- [ ] **Layout Components**
  - [ ] GameLayout (HUD + content)
  - [ ] MenuLayout
  - [ ] BattleLayout
- [ ] **Game Cards**
  - [ ] CharacterCard
  - [ ] ItemCard
  - [ ] QuestCard
  - [ ] EnemyCard
  - [ ] SkillCard
- [ ] **Interactive Components**
  - [ ] DialogueBox
  - [ ] ChoiceButtons
  - [ ] InventoryGrid
  - [ ] SkillWheel
  - [ ] ProgressBar (HP, MP, EXP)
- [ ] **Battle UI**
  - [ ] TacticalGrid
  - [ ] UnitCard (on grid)
  - [ ] ActionMenu
  - [ ] TargetSelector
  - [ ] TurnOrder display
  - [ ] DamageNumbers

### 4.3 Mock Data Structure
- [ ] Create `/src/data/mock/` folder
  - [ ] `characters.mock.ts` - 10+ characters
  - [ ] `enemies.mock.ts` - 20+ monsters
  - [ ] `quests.mock.ts` - 30+ quests
  - [ ] `items.mock.ts` - 100+ items
  - [ ] `skills.mock.ts` - 50+ skills
  - [ ] `locations.mock.ts` - 20+ locations
  - [ ] `story.mock.ts` - Story events
  - [ ] `battles.mock.ts` - Battle scenarios

---

## 🔌 Phase 5: Backend Integration

### 5.1 Database Implementation
- [ ] Implement all database schemas
- [ ] Create RPC functions
- [ ] Setup row-level security
- [ ] Create database triggers
- [ ] Implement indexes

### 5.2 API Development
- [ ] Character CRUD
- [ ] Quest progress tracking
- [ ] Inventory management
- [ ] Battle system API
- [ ] Save/Load API
- [ ] Multiplayer API

### 5.3 Real-time Features
- [ ] Socket.io server setup
- [ ] Combat synchronization
- [ ] Co-op session management
- [ ] Real-time notifications
- [ ] Live player positions

### 5.4 Authentication & Authorization
- [ ] Supabase Auth integration
- [ ] JWT token management
- [ ] Profile management
- [ ] Character slot management

---

## 🚀 Phase 6: Testing & Optimization

### 6.1 Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests
- [ ] Combat system testing
- [ ] Multiplayer testing
- [ ] Save/Load testing

### 6.2 Performance Optimization
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Bundle size optimization
- [ ] Database query optimization
- [ ] Caching strategy

### 6.3 Game Balance
- [ ] Combat balance testing
- [ ] Difficulty curve
- [ ] Item rarity balance
- [ ] EXP curve
- [ ] Economy balance

---

## 📱 Phase 7: Deployment & Post-Launch

### 7.1 Deployment
- [ ] Vercel deployment
- [ ] Supabase production setup
- [ ] Environment variables
- [ ] CDN setup for assets
- [ ] Domain configuration

### 7.2 Monitoring & Analytics
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Performance monitoring
- [ ] User behavior tracking
- [ ] Bug reporting system

### 7.3 Post-Launch Content
- [ ] New story chapters
- [ ] New characters & classes
- [ ] New dungeons
- [ ] Seasonal events
- [ ] Community events
- [ ] Balance patches

---

## 📊 Progress Summary

**Phase 1:** Foundation - 0%
**Phase 2:** Core Systems - 0%
**Phase 3:** Advanced Features - 0%
**Phase 4:** UI/UX - 0%
**Phase 5:** Backend - 0%
**Phase 6:** Testing - 0%
**Phase 7:** Launch - 0%

**Overall Progress: 0%** 🎮

---

## 🎯 Recommended Development Order

1. **Foundation Setup** (Week 1-2)
   - Project structure
   - Design system
   - Database schema

2. **Core Combat System** (Week 3-6)
   - Tactical grid implementation
   - Basic battle mechanics
   - Skills & abilities

3. **Character & Party** (Week 7-8)
   - Character system
   - Party management
   - Progression system

4. **World & Exploration** (Week 9-12)
   - World map
   - Location system
   - NPC interaction

5. **Story & Quests** (Week 13-15)
   - Quest system
   - Story events
   - Dialogue system

6. **Items & Crafting** (Week 16-17)
   - Inventory
   - Equipment
   - Crafting

7. **Advanced Features** (Week 18-20)
   - Dungeons
   - Achievements
   - Save system

8. **Multiplayer** (Week 21-24)
   - Co-op implementation
   - Synchronization
   - Testing

9. **Polish & Testing** (Week 25-28)
   - UI polish
   - Bug fixes
   - Balance testing

10. **Launch Prep** (Week 29-30)
    - Deployment
    - Marketing
    - Documentation

**Estimated Timeline: 30 weeks (7-8 months)**

---

## 📝 Notes

- Focus on **Dynamic Tactical Grid Combat** first - it's the core differentiator
- Each battle map has unique grid size and shape (like Dragon Quest Tact)
- Grid sizes vary: 5x5 (small), 7x7 (medium), 9x9 (large), 10x10+ (boss battles)
- Use **mock data** extensively during Phase 2-4
- **Mobile-first** approach for UI
- **Performance** is critical for combat animations
- **Save system** must be rock-solid
- **Multiplayer** is complex - allocate extra time
- Consider **early access** release after Phase 4
- **Community feedback** is essential for balance

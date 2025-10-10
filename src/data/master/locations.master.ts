import { Location, LocationConnection } from "@/src/domain/types/location.types";

/**
 * Master Data: Hierarchical World Map
 * Structure: World → Continent → Region → Area → City → Building → Floor → Room
 */

// Helper function to generate walkable tiles
const generateWalkableTiles = (width: number, height: number) => {
  return Array.from({ length: width * height }, (_, i) => ({
    x: i % width,
    y: Math.floor(i / width),
    type: "grass" as const,
    isWalkable: true,
    height: 0,
  }));
};

export const LOCATIONS_MASTER: Location[] = [
  // ========================================
  // LEVEL 0: WORLD
  // ========================================
  {
    id: "world-aethoria",
    parentId: null,
    name: "เอธอเรีย",
    nameEn: "Aethoria",
    type: "world",
    level: 0,
    path: ["world-aethoria"],
    slug: "aethoria",
    description: "โลกแฟนตาซีที่เต็มไปด้วยเวทมนตร์และการผจญภัย",
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: false,
    timeEnabled: false,
    mapData: {
      dimensions: { columns: 50, rows: 50 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(50, 50),
    },
  },

  // ========================================
  // LEVEL 1: CONTINENTS
  // ========================================
  {
    id: "continent-northern",
    parentId: "world-aethoria",
    name: "ทวีปเหนือ",
    nameEn: "Northern Continent",
    type: "continent",
    level: 1,
    path: ["world-aethoria", "continent-northern"],
    slug: "northern-continent",
    description: "ดินแดนที่หนาวเย็นและเต็มไปด้วยภูเขาสูง",
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: true,
    currentWeather: "snow",
    timeEnabled: true,
    mapData: {
      dimensions: { columns: 30, rows: 30 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(30, 30),
    },
  },

  {
    id: "continent-eastern",
    parentId: "world-aethoria",
    name: "ทวีปตะวันออก",
    nameEn: "Eastern Continent",
    type: "continent",
    level: 1,
    path: ["world-aethoria", "continent-eastern"],
    slug: "eastern-continent",
    description: "ดินแดนแห่งป่าไม้และธรรมชาติอันอุดมสมบูรณ์",
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: true,
    currentWeather: "sunny",
    timeEnabled: true,
    mapData: {
      dimensions: { columns: 30, rows: 30 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(30, 30),
    },
  },

  // ========================================
  // LEVEL 2: REGIONS
  // ========================================
  {
    id: "region-frostpeak",
    parentId: "continent-northern",
    name: "ฟรอสต์พีค",
    nameEn: "Frostpeak Mountains",
    type: "region",
    level: 2,
    path: ["world-aethoria", "continent-northern", "region-frostpeak"],
    slug: "frostpeak-mountains",
    description: "เทือกเขาน้ำแข็งที่สูงตระหง่าน",
    isDiscoverable: true,
    isFastTravelPoint: false,
    requiredLevel: 10,
    weatherEnabled: true,
    currentWeather: "snow",
    timeEnabled: true,
    backgroundMusic: "/audio/bgm/frostpeak.mp3",
    ambientSound: "/audio/ambient/wind.mp3",
    mapData: {
      dimensions: { columns: 25, rows: 25 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(25, 25),
    },
  },

  {
    id: "region-elven-forest",
    parentId: "continent-eastern",
    name: "ป่าเอลฟ์",
    nameEn: "Elven Forest",
    type: "region",
    level: 2,
    path: ["world-aethoria", "continent-eastern", "region-elven-forest"],
    slug: "elven-forest",
    description: "ป่าโบราณที่เป็นที่อยู่ของเผ่าเอลฟ์",
    isDiscoverable: true,
    isFastTravelPoint: false,
    requiredLevel: 5,
    weatherEnabled: true,
    currentWeather: "sunny",
    timeEnabled: true,
    backgroundMusic: "/audio/bgm/elven-forest.mp3",
    ambientSound: "/audio/ambient/forest.mp3",
    mapData: {
      dimensions: { columns: 25, rows: 25 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(25, 25),
    },
  },

  // ========================================
  // LEVEL 3: AREAS
  // ========================================
  {
    id: "area-crystal-valley",
    parentId: "region-frostpeak",
    name: "หุบเขาคริสตัล",
    nameEn: "Crystal Valley",
    type: "area",
    level: 3,
    path: [
      "world-aethoria",
      "continent-northern",
      "region-frostpeak",
      "area-crystal-valley",
    ],
    slug: "crystal-valley",
    description: "หุบเขาที่เต็มไปด้วยคริสตัลน้ำแข็งเรืองแสง",
    isDiscoverable: true,
    isFastTravelPoint: true,
    requiredLevel: 15,
    weatherEnabled: true,
    currentWeather: "clear",
    timeEnabled: true,
    encounterTableId: "encounter-ice-monsters",
    mapData: {
      dimensions: { columns: 20, rows: 20 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(20, 20),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
      encounters: ["ice-wolf", "frost-giant", "ice-elemental"],
      secrets: ["hidden-cave-1"],
    },
  },

  // ========================================
  // LEVEL 4: CITIES
  // ========================================
  {
    id: "city-silverhold",
    parentId: "area-crystal-valley",
    name: "ซิลเวอร์โฮลด์",
    nameEn: "Silverhold",
    type: "city",
    level: 4,
    path: [
      "world-aethoria",
      "continent-northern",
      "region-frostpeak",
      "area-crystal-valley",
      "city-silverhold",
    ],
    slug: "silverhold",
    description: "เมืองป้อมปราการที่สร้างจากหินและน้ำแข็ง",
    isDiscoverable: true,
    isFastTravelPoint: true,
    requiredLevel: 10,
    weatherEnabled: true,
    currentWeather: "snow",
    timeEnabled: true,
    backgroundMusic: "/audio/bgm/city-theme.mp3",
    ambientSound: "/audio/ambient/city.mp3",
    mapData: {
      dimensions: { columns: 20, rows: 15 },
      tileSize: 40, // ✅ Fixed: Each tile = 40px (standard grid size)
      // Pre-generate walkable tiles for testing
      tiles: Array.from({ length: 20 * 15 }, (_, i) => ({
        x: i % 20,
        y: Math.floor(i / 20),
        type: "grass" as const,
        isWalkable: true,
        height: 0,
      })),
    },
    metadata: {
      // NPCs with positions on map (tile coordinates)
      npcs: [
        { 
          id: "npc-mayor", 
          coordinates: { x: 10, y: 5 }, // Center of city hall
          name: "Mayor Aldric",
          hasQuest: true,
          questId: "quest-main-1"
        },
        { 
          id: "npc-blacksmith", 
          coordinates: { x: 15, y: 8 }, // Near forge
          name: "Blacksmith Gorin",
          hasQuest: false
        },
        { 
          id: "npc-merchant", 
          coordinates: { x: 7, y: 6 }, // Market square
          name: "Merchant Lyra",
          hasQuest: true,
          questId: "quest-side-1"
        },
      ],
      
      // Shops with positions
      shops: [
        { 
          id: "shop-weapons", 
          coordinates: { x: 14, y: 7 }, // Near blacksmith
          name: "Weapon Shop",
          shopType: "weapons" as const
        },
        { 
          id: "shop-armor", 
          coordinates: { x: 16, y: 9 }, // Armor district
          name: "Armor Shop",
          shopType: "armor" as const
        },
        { 
          id: "shop-items", 
          coordinates: { x: 8, y: 7 }, // Market area
          name: "General Store",
          shopType: "items" as const
        },
      ],
      
      // Services with positions
      services: [
        { 
          id: "inn", 
          coordinates: { x: 5, y: 10 }, // Residential area
          name: "The Frozen Hearth Inn",
          serviceType: "inn" as const
        },
        { 
          id: "guild", 
          coordinates: { x: 3, y: 5 }, // Guild district (matches building-guild-hall connection)
          name: "Adventurer's Guild",
          serviceType: "guild" as const
        },
        { 
          id: "bank", 
          coordinates: { x: 12, y: 4 }, // Financial district
          name: "Silverhold Bank",
          serviceType: "bank" as const
        },
      ],
      
      // Battle triggers with positions
      battleMaps: [
        {
          id: "map-forest-clearing",
          battleMapId: "map-forest-clearing",
          coordinates: { x: 2, y: 12 }, // Forest entrance (south)
          name: "Forest Clearing",
          difficulty: "normal" as const
        },
        {
          id: "map-cave-entrance",
          battleMapId: "map-cave-entrance",
          coordinates: { x: 18, y: 3 }, // Cave entrance (north-east)
          name: "Cave Entrance",
          difficulty: "hard" as const
        },
      ],
      
      // Treasure chests
      treasures: [
        {
          id: "treasure-city-1",
          treasureId: "treasure-city-1",
          coordinates: { x: 1, y: 1 }, // Hidden corner
          name: "Hidden Chest"
        },
      ],
    },
  },

  {
    id: "city-elvenheim",
    parentId: "region-elven-forest",
    name: "เอลเวนไฮม์",
    nameEn: "Elvenheim",
    type: "city",
    level: 3,
    path: [
      "world-aethoria",
      "continent-eastern",
      "region-elven-forest",
      "city-elvenheim",
    ],
    slug: "elvenheim",
    description: "เมืองหลวงของเผ่าเอลฟ์ที่สร้างบนต้นไม้ยักษ์",
    isDiscoverable: true,
    isFastTravelPoint: true,
    requiredLevel: 5,
    weatherEnabled: true,
    currentWeather: "sunny",
    timeEnabled: true,
    backgroundMusic: "/audio/bgm/elven-city.mp3",
    ambientSound: "/audio/ambient/nature.mp3",
    mapData: {
      dimensions: { columns: 20, rows: 15 },
      tileSize: 40, // Standard grid size
      // Pre-generate walkable tiles for testing
      tiles: Array.from({ length: 20 * 15 }, (_, i) => ({
        x: i % 20,
        y: Math.floor(i / 20),
        type: "grass" as const,
        isWalkable: true,
        height: 0,
      })),
    },
    metadata: {
      // NPCs with positions
      npcs: [
        { 
          id: "npc-elder", 
          coordinates: { x: 10, y: 7 }, // Elder's tree house
          name: "Elder Thalion",
          hasQuest: true,
          questId: "quest-elven-1"
        },
        { 
          id: "npc-archer-trainer", 
          coordinates: { x: 15, y: 5 }, // Training grounds
          name: "Archer Trainer Sylvara",
          hasQuest: false
        },
        { 
          id: "npc-herbalist", 
          coordinates: { x: 5, y: 9 }, // Herb garden
          name: "Herbalist Elara",
          hasQuest: true,
          questId: "quest-herbs-1"
        },
      ],
      
      // Shops with positions
      shops: [
        { 
          id: "shop-magic", 
          coordinates: { x: 12, y: 8 }, // Magic district
          name: "Arcane Emporium",
          shopType: "magic" as const
        },
        { 
          id: "shop-bows", 
          coordinates: { x: 16, y: 6 }, // Near training grounds
          name: "Elven Bowyer",
          shopType: "weapons" as const
        },
        { 
          id: "shop-potions", 
          coordinates: { x: 6, y: 10 }, // Near herb garden
          name: "Potion Shop",
          shopType: "potions" as const
        },
      ],
      
      // Services with positions
      services: [
        { 
          id: "inn", 
          coordinates: { x: 8, y: 12 }, // Residential area
          name: "The Moonlit Rest",
          serviceType: "inn" as const
        },
        { 
          id: "guild", 
          coordinates: { x: 13, y: 4 }, // Guild hall
          name: "Elven Rangers Guild",
          serviceType: "guild" as const
        },
        { 
          id: "temple", 
          coordinates: { x: 3, y: 3 }, // Sacred grove
          name: "Temple of Moonlight",
          serviceType: "temple" as const
        },
      ],
    },
  },

  // ========================================
  // LEVEL 5: BUILDINGS
  // ========================================
  {
    id: "building-guild-hall",
    parentId: "city-silverhold",
    name: "หอสมาคมนักผจญภัย",
    nameEn: "Adventurer's Guild Hall",
    type: "building",
    level: 5,
    path: [
      "world-aethoria",
      "continent-northern",
      "region-frostpeak",
      "area-crystal-valley",
      "city-silverhold",
      "building-guild-hall",
    ],
    slug: "guild-hall",
    description: "สำนักงานใหญ่ของสมาคมนักผจญภัย",
    isDiscoverable: true,
    isFastTravelPoint: true,
    weatherEnabled: false,
    timeEnabled: false,
    backgroundMusic: "/audio/bgm/guild.mp3",
    mapData: {
      dimensions: { columns: 15, rows: 15 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(15, 15),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
    },
  },

  {
    id: "building-magic-tower",
    parentId: "city-elvenheim",
    name: "หอคอยเวทมนตร์",
    nameEn: "Magic Tower",
    type: "tower",
    level: 4,
    path: [
      "world-aethoria",
      "continent-eastern",
      "region-elven-forest",
      "city-elvenheim",
      "building-magic-tower",
    ],
    slug: "magic-tower",
    description: "หอคอยสูงที่เป็นศูนย์กลางการศึกษาเวทมนตร์",
    isDiscoverable: true,
    isFastTravelPoint: true,
    requiredLevel: 10,
    weatherEnabled: false,
    timeEnabled: false,
    backgroundMusic: "/audio/bgm/magic-tower.mp3",
    mapData: {
      dimensions: { columns: 15, rows: 15 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(15, 15),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
    },
  },

  // ========================================
  // LEVEL 6: FLOORS
  // ========================================
  {
    id: "floor-guild-1f",
    parentId: "building-guild-hall",
    name: "ชั้น 1 - ล็อบบี้",
    nameEn: "1st Floor - Lobby",
    type: "floor",
    level: 6,
    path: [
      "world-aethoria",
      "continent-northern",
      "region-frostpeak",
      "area-crystal-valley",
      "city-silverhold",
      "building-guild-hall",
      "floor-guild-1f",
    ],
    slug: "guild-1f",
    description: "ชั้นต้อนรับและกระดานเควสต์",
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: false,
    timeEnabled: false,
    mapData: {
      dimensions: { columns: 15, rows: 10 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(15, 10),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
    },
  },

  {
    id: "floor-guild-2f",
    parentId: "floor-guild-1f",
    name: "ชั้น 2 - ห้องประชุม",
    nameEn: "2nd Floor - Meeting Rooms",
    type: "floor",
    level: 7,
    path: [
      "world-aethoria",
      "continent-northern",
      "region-frostpeak",
      "area-crystal-valley",
      "city-silverhold",
      "building-guild-hall",
      "floor-guild-1f",
      "floor-guild-2f",
    ],
    slug: "guild-2f",
    description: "ห้องสำหรับการประชุมและวางแผนภารกิจ",
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: false,
    timeEnabled: false,
    mapData: {
      dimensions: { columns: 15, rows: 10 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(15, 10),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
    },
  },

  {
    id: "floor-tower-1f",
    parentId: "building-magic-tower",
    name: "ชั้น 1 - ห้องสมุด",
    nameEn: "1st Floor - Library",
    type: "floor",
    level: 5,
    path: [
      "world-aethoria",
      "continent-eastern",
      "region-elven-forest",
      "city-elvenheim",
      "building-magic-tower",
      "floor-tower-1f",
    ],
    slug: "tower-1f",
    description: "ห้องสมุดเวทมนตร์ที่เก็บหนังสือโบราณ",
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: false,
    timeEnabled: false,
    mapData: {
      dimensions: { columns: 12, rows: 12 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(12, 12),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
    },
  },

  // ========================================
  // LEVEL 7: ROOMS
  // ========================================
  {
    id: "room-guild-master",
    parentId: "floor-guild-2f",
    name: "ห้องหัวหน้าสมาคม",
    nameEn: "Guild Master's Office",
    type: "room",
    level: 8,
    path: [
      "world-aethoria",
      "continent-northern",
      "region-frostpeak",
      "area-crystal-valley",
      "city-silverhold",
      "building-guild-hall",
      "floor-guild-1f",
      "floor-guild-2f",
      "room-guild-master",
    ],
    slug: "guild-master-office",
    description: "ห้องทำงานของหัวหน้าสมาคมนักผจญภัย",
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: false,
    timeEnabled: false,
    mapData: {
      dimensions: { columns: 10, rows: 8 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(10, 8),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
    },
  },

  {
    id: "room-meeting-1",
    parentId: "floor-guild-2f",
    name: "ห้องประชุม A",
    nameEn: "Meeting Room A",
    type: "room",
    level: 8,
    path: [
      "world-aethoria",
      "continent-northern",
      "region-frostpeak",
      "area-crystal-valley",
      "city-silverhold",
      "building-guild-hall",
      "floor-guild-1f",
      "floor-guild-2f",
      "room-meeting-1",
    ],
    slug: "meeting-room-a",
    description: "ห้องประชุมสำหรับวางแผนภารกิจ",
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: false,
    timeEnabled: false,
    mapData: {
      dimensions: { columns: 8, rows: 8 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(8, 8),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
    },
  },

  // ========================================
  // DUNGEONS
  // ========================================
  {
    id: "dungeon-frozen-depths",
    parentId: "area-crystal-valley",
    name: "ดันเจี้ยนน้ำแข็งลึก",
    nameEn: "Frozen Depths",
    type: "dungeon",
    level: 4,
    path: [
      "world-aethoria",
      "continent-northern",
      "region-frostpeak",
      "area-crystal-valley",
      "dungeon-frozen-depths",
    ],
    slug: "frozen-depths",
    description: "ดันเจี้ยนใต้ดินที่เต็มไปด้วยมอนสเตอร์น้ำแข็ง",
    isDiscoverable: true,
    isFastTravelPoint: false,
    requiredLevel: 20,
    weatherEnabled: false,
    timeEnabled: false,
    backgroundMusic: "/audio/bgm/dungeon.mp3",
    ambientSound: "/audio/ambient/dungeon.mp3",
    encounterTableId: "encounter-frozen-depths",
    mapData: {
      dimensions: { columns: 25, rows: 25 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(25, 25),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
      encounters: ["ice-golem", "frost-dragon", "frozen-undead"],
      secrets: ["secret-boss-room"],
    },
  },

  // ========================================
  // ADDITIONAL LOCATIONS FOR TESTING
  // ========================================
  {
    id: "field-starting-plains",
    parentId: "continent-northern",
    name: "ทุ่งหญ้าเริ่มต้น",
    nameEn: "Starting Plains",
    type: "field",
    level: 2,
    path: ["world-aethoria", "continent-northern", "field-starting-plains"],
    slug: "starting-plains",
    description: "ทุ่งหญ้ากว้างใหญ่สำหรับผู้เริ่มต้นการผจญภัย",
    isDiscoverable: true,
    isFastTravelPoint: true,
    requiredLevel: 1,
    weatherEnabled: true,
    currentWeather: "sunny",
    timeEnabled: true,
    backgroundMusic: "/audio/bgm/plains.mp3",
    encounterTableId: "encounter-plains",
    mapData: {
      dimensions: { columns: 30, rows: 25 },
      tileSize: 40, // Standard grid size
      // Pre-generate walkable tiles for testing
      tiles: Array.from({ length: 30 * 25 }, (_, i) => ({
        x: i % 30,
        y: Math.floor(i / 30),
        type: "grass" as const,
        isWalkable: true,
        height: 0,
      })),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
      encounters: ["slime", "goblin", "wild-boar"],
    },
  },

  {
    id: "town-riverside",
    parentId: "continent-eastern",
    name: "เมืองริมน้ำ",
    nameEn: "Riverside Town",
    type: "town",
    level: 2,
    path: ["world-aethoria", "continent-eastern", "town-riverside"],
    slug: "riverside-town",
    description: "เมืองเล็กๆ ริมฝั่งแม่น้ำที่เงียบสงบ",
    isDiscoverable: true,
    isFastTravelPoint: true,
    requiredLevel: 5,
    weatherEnabled: true,
    currentWeather: "sunny",
    timeEnabled: true,
    backgroundMusic: "/audio/bgm/town.mp3",
    mapData: {
      dimensions: { columns: 18, rows: 15 },
      tileSize: 40, // Standard grid size
      // Pre-generate walkable tiles for testing
      tiles: Array.from({ length: 18 * 15 }, (_, i) => ({
        x: i % 18,
        y: Math.floor(i / 18),
        type: "grass" as const,
        isWalkable: true,
        height: 0,
      })),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
      battleMaps: [],
      treasures: [],
    },
  },
];

// ========================================
// LOCATION CONNECTIONS
// ========================================
export const LOCATION_CONNECTIONS_MASTER: LocationConnection[] = [
  // ========================================
  // LEVEL 0-1: World → Continents
  // ========================================
  {
    id: "conn-world-1",
    from: {
      locationId: "world-aethoria",
      coordinates: { x: 10, y: 5 }, // Portal position on world map
    },
    to: {
      locationId: "continent-northern",
      coordinates: { x: 15, y: 15 }, // Spawn point on continent
    },
    connectionType: "portal",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-world-2",
    from: {
      locationId: "world-aethoria",
      coordinates: { x: 35, y: 15 }, // Portal position on world map
    },
    to: {
      locationId: "continent-eastern",
      coordinates: { x: 15, y: 15 }, // Spawn point on continent
    },
    connectionType: "portal",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 1-1: Between Continents
  // ========================================
  {
    id: "conn-1",
    from: {
      locationId: "continent-northern",
      coordinates: { x: 25, y: 15 }, // Bridge on northern continent
    },
    to: {
      locationId: "continent-eastern",
      coordinates: { x: 5, y: 15 }, // Bridge on eastern continent
    },
    connectionType: "bridge",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 1-2: Continents → Regions
  // ========================================
  {
    id: "conn-continent-1",
    from: {
      locationId: "continent-northern",
      coordinates: { x: 8, y: 5 }, // Gate on continent
    },
    to: {
      locationId: "region-frostpeak",
      coordinates: { x: 12, y: 12 }, // Spawn in region
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-continent-2",
    from: {
      locationId: "continent-eastern",
      coordinates: { x: 15, y: 10 }, // Gate on continent
    },
    to: {
      locationId: "region-elven-forest",
      coordinates: { x: 12, y: 12 }, // Spawn in region
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 2-3: Regions → Areas/Cities
  // ========================================
  {
    id: "conn-region-1",
    from: {
      locationId: "region-frostpeak",
      coordinates: { x: 10, y: 8 }, // Gate on region
    },
    to: {
      locationId: "area-crystal-valley",
      coordinates: { x: 10, y: 10 }, // Spawn in area
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-region-2",
    from: {
      locationId: "region-elven-forest",
      coordinates: { x: 12, y: 5 }, // Gate on region
    },
    to: {
      locationId: "city-elvenheim",
      coordinates: { x: 10, y: 7 }, // Spawn in city
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 3-4: Areas → Cities
  // ========================================
  {
    id: "conn-area-1",
    from: {
      locationId: "area-crystal-valley",
      coordinates: { x: 10, y: 7 }, // Gate on area
    },
    to: {
      locationId: "city-silverhold",
      coordinates: { x: 10, y: 7 }, // Spawn at city center
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 4-5: Cities → Buildings
  // ========================================
  {
    id: "conn-2",
    from: {
      locationId: "city-silverhold",
      coordinates: { x: 3, y: 5 }, // Guild entrance on city map
    },
    to: {
      locationId: "building-guild-hall",
      coordinates: { x: 7, y: 7 }, // Spawn at guild center
    },
    connectionType: "entrance",
    isLocked: false,
    isTwoWay: true,
  },

  // Reverse connection for two-way travel
  {
    id: "conn-2-reverse",
    from: {
      locationId: "building-guild-hall",
      coordinates: { x: 7, y: 0 }, // Exit at bottom of guild
    },
    to: {
      locationId: "city-silverhold",
      coordinates: { x: 3, y: 5 }, // Return to guild entrance
    },
    connectionType: "entrance",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-6",
    from: {
      locationId: "city-elvenheim",
      coordinates: { x: 12, y: 8 }, // Tower entrance on city map
    },
    to: {
      locationId: "building-magic-tower",
      coordinates: { x: 7, y: 7 }, // Spawn at tower center
    },
    connectionType: "entrance",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 5-6: Buildings → Floors
  // ========================================
  {
    id: "conn-building-1",
    from: {
      locationId: "building-guild-hall",
      coordinates: { x: 7, y: 7 }, // Stairs at center
    },
    to: {
      locationId: "floor-guild-1f",
      coordinates: { x: 7, y: 5 }, // Spawn on 1F
    },
    connectionType: "stairs",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-3",
    from: {
      locationId: "floor-guild-1f",
      coordinates: { x: 12, y: 5 }, // Stairs on 1F
    },
    to: {
      locationId: "floor-guild-2f",
      coordinates: { x: 2, y: 5 }, // Spawn on 2F
    },
    connectionType: "stairs",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-7",
    from: {
      locationId: "building-magic-tower",
      coordinates: { x: 7, y: 7 }, // Stairs at center
    },
    to: {
      locationId: "floor-tower-1f",
      coordinates: { x: 7, y: 5 }, // Spawn on 1F
    },
    connectionType: "stairs",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 6-7: Floors → Rooms
  // ========================================
  {
    id: "conn-4",
    from: {
      locationId: "floor-guild-2f",
      coordinates: { x: 10, y: 3 }, // Door on 2F
    },
    to: {
      locationId: "room-guild-master",
      coordinates: { x: 5, y: 4 }, // Spawn in room
    },
    connectionType: "door",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-5",
    from: {
      locationId: "floor-guild-2f",
      coordinates: { x: 5, y: 3 }, // Door on 2F
    },
    to: {
      locationId: "room-meeting-1",
      coordinates: { x: 4, y: 4 }, // Spawn in room
    },
    connectionType: "door",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // DUNGEONS
  // ========================================
  {
    id: "conn-8",
    from: {
      locationId: "area-crystal-valley",
      coordinates: { x: 5, y: 5 }, // Dungeon entrance on area map
    },
    to: {
      locationId: "dungeon-frozen-depths",
      coordinates: { x: 12, y: 12 }, // Spawn in dungeon
    },
    connectionType: "entrance",
    isLocked: true,
    requiredItemId: "item-crystal-key",
    isTwoWay: true,
  },

  // ========================================
  // ADDITIONAL CONNECTIONS
  // ========================================
  {
    id: "conn-9",
    from: {
      locationId: "continent-northern",
      coordinates: { x: 15, y: 10 }, // Gate on continent
    },
    to: {
      locationId: "field-starting-plains",
      coordinates: { x: 15, y: 12 }, // Spawn in field
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-10",
    from: {
      locationId: "continent-eastern",
      coordinates: { x: 20, y: 18 }, // Gate on continent
    },
    to: {
      locationId: "town-riverside",
      coordinates: { x: 9, y: 7 }, // Spawn in town
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Build hierarchical location tree
 */
export function buildLocationTree(locations: Location[]): Location[] {
  const locationMap = new Map<string, Location>();
  const rootLocations: Location[] = [];

  // Create map of all locations
  locations.forEach((loc) => {
    locationMap.set(loc.id, { ...loc, children: [] });
  });

  // Build tree structure
  locations.forEach((loc) => {
    const location = locationMap.get(loc.id)!;
    if (loc.parentId) {
      const parent = locationMap.get(loc.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(location);
      }
    } else {
      rootLocations.push(location);
    }
  });

  return rootLocations;
}

/**
 * Get location by ID
 */
export function getLocationById(id: string): Location | undefined {
  return LOCATIONS_MASTER.find((loc) => loc.id === id);
}

/**
 * Get children of a location
 */
export function getLocationChildren(parentId: string): Location[] {
  return LOCATIONS_MASTER.filter((loc) => loc.parentId === parentId);
}

/**
 * Get location path (breadcrumb)
 */
export function getLocationPath(locationId: string): Location[] {
  const location = getLocationById(locationId);
  if (!location) return [];

  const path: Location[] = [location];
  let currentParentId = location.parentId;

  while (currentParentId) {
    const parent = getLocationById(currentParentId);
    if (parent) {
      path.unshift(parent);
      currentParentId = parent.parentId;
    } else {
      break;
    }
  }

  return path;
}

/**
 * Get connection by ID
 */
export function getConnectionById(id: string): LocationConnection | undefined {
  return LOCATION_CONNECTIONS_MASTER.find((conn) => conn.id === id);
}

/**
 * Get connections for a location
 */
export function getLocationConnections(locationId: string): LocationConnection[] {
  return LOCATION_CONNECTIONS_MASTER.filter(
    (conn) => conn.from.locationId === locationId || conn.to.locationId === locationId
  );
}

// Export hierarchical tree
export const LOCATION_TREE_MASTER = buildLocationTree(LOCATIONS_MASTER);

import {
  Location,
  LocationConnection,
} from "@/src/domain/types/location.types";

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
    mapData: {
      dimensions: { columns: 20, rows: 20 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(20, 20),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
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
          tileCoordinate: { x: 10, y: 5 }, // Center of city hall
          name: "Mayor Aldric",
          hasQuest: true,
          questId: "quest-main-1",
          gridSize: { width: 2, height: 2 }, // Important NPC - larger size
        },
        {
          id: "npc-blacksmith",
          tileCoordinate: { x: 15, y: 8 }, // Near forge
          name: "Blacksmith Gorin",
          hasQuest: false,
          gridSize: { width: 1, height: 1 }, // Regular NPC
        },
        {
          id: "npc-merchant",
          tileCoordinate: { x: 7, y: 6 }, // Market square
          name: "Merchant Lyra",
          hasQuest: true,
          questId: "quest-side-1",
          gridSize: { width: 1, height: 1 }, // Regular NPC
        },
      ],

      // Shops with positions
      shops: [
        {
          id: "shop-weapons",
          tileCoordinate: { x: 14, y: 7 }, // Near blacksmith
          name: "Weapon Shop",
          shopType: "weapons" as const,
          gridSize: { width: 2, height: 2 }, // Medium shop
        },
        {
          id: "shop-armor",
          tileCoordinate: { x: 16, y: 9 }, // Armor district
          name: "Armor Shop",
          shopType: "armor" as const,
          gridSize: { width: 2, height: 2 }, // Medium shop
        },
        {
          id: "shop-items",
          tileCoordinate: { x: 8, y: 7 }, // Market area
          name: "General Store",
          shopType: "items" as const,
          gridSize: { width: 2, height: 2 }, // Medium shop
        },
      ],

      // Services with positions
      services: [
        {
          id: "inn",
          tileCoordinate: { x: 5, y: 10 }, // Residential area
          name: "The Frozen Hearth Inn",
          serviceType: "inn" as const,
          gridSize: { width: 3, height: 3 }, // Large building
        },
        {
          id: "guild",
          tileCoordinate: { x: 3, y: 5 }, // Guild district (matches building-guild-hall connection)
          name: "Adventurer's Guild",
          serviceType: "guild" as const,
          gridSize: { width: 3, height: 4 }, // Very large building
        },
        {
          id: "bank",
          tileCoordinate: { x: 12, y: 4 }, // Financial district
          name: "Silverhold Bank",
          serviceType: "bank" as const,
          gridSize: { width: 2, height: 3 }, // Medium-large building
        },
      ],

      // Treasure chests
      treasures: [
        {
          id: "treasure-city-1",
          treasureId: "treasure-city-1",
          tileCoordinate: { x: 1, y: 1 }, // Hidden corner
          name: "Hidden Chest",
          gridSize: { width: 1, height: 1 }, // Small treasure
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
          tileCoordinate: { x: 10, y: 7 }, // Elder's tree house
          name: "Elder Thalion",
          hasQuest: true,
          questId: "quest-elven-1",
          gridSize: { width: 3, height: 3 }, // Very important elder - large size
        },
        {
          id: "npc-archer-trainer",
          tileCoordinate: { x: 15, y: 5 }, // Training grounds
          name: "Archer Trainer Sylvara",
          hasQuest: false,
          gridSize: { width: 1, height: 1 }, // Regular NPC
        },
        {
          id: "npc-herbalist",
          tileCoordinate: { x: 5, y: 9 }, // Herb garden
          name: "Herbalist Elara",
          hasQuest: true,
          questId: "quest-herbs-1",
          gridSize: { width: 1, height: 1 }, // Regular NPC
        },
      ],

      // Shops with positions
      shops: [
        {
          id: "shop-magic",
          tileCoordinate: { x: 12, y: 8 }, // Magic district
          name: "Arcane Emporium",
          shopType: "magic" as const,
          gridSize: { width: 3, height: 2 }, // Large magic shop
        },
        {
          id: "shop-bows",
          tileCoordinate: { x: 16, y: 6 }, // Near training grounds
          name: "Elven Bowyer",
          shopType: "weapons" as const,
          gridSize: { width: 2, height: 2 }, // Medium shop
        },
        {
          id: "shop-potions",
          tileCoordinate: { x: 6, y: 10 }, // Near herb garden
          name: "Potion Shop",
          shopType: "potions" as const,
          gridSize: { width: 2, height: 2 }, // Medium shop
        },
      ],

      // Services with positions
      services: [
        {
          id: "inn",
          tileCoordinate: { x: 8, y: 12 }, // Residential area
          name: "The Moonlit Rest",
          serviceType: "inn" as const,
          gridSize: { width: 3, height: 3 }, // Large building
        },
        {
          id: "guild",
          tileCoordinate: { x: 13, y: 4 }, // Guild hall
          name: "Elven Rangers Guild",
          serviceType: "guild" as const,
          gridSize: { width: 3, height: 4 }, // Very large building
        },
        {
          id: "temple",
          tileCoordinate: { x: 3, y: 3 }, // Sacred grove
          name: "Temple of Moonlight",
          serviceType: "temple" as const,
          gridSize: { width: 4, height: 4 }, // Massive temple
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
    mapData: {
      dimensions: { columns: 25, rows: 25 },
      tileSize: 40, // Standard grid size
      tiles: generateWalkableTiles(25, 25),
    },
    metadata: {
      npcs: [],
      shops: [],
      services: [],
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
      treasures: [],
    },
  },
];

// ========================================
// LOCATION CONNECTIONS
// ========================================
export const LOCATION_CONNECTIONS_MASTER: LocationConnection[] = [
  // ========================================
  // LEVEL 0-1: World → Continents (Parent → Child)
  // Pattern: entrance ตรงกลาง parent, spawn = entrance position (ตำแหน่งเดียวกัน)
  // world-aethoria: 50x50, continent: 30x30
  // ========================================
  {
    id: "conn-world-1",
    from: {
      locationId: "world-aethoria", // 50x50
      tileCoordinate: { x: 16, y: 24 }, // ตรงกลาง parent (50/2 = 25)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "continent-northern", // 30x30
      tileCoordinate: { x: 14, y: 29 }, // ตรงกลางล่างสุด child (30/2 = 15)
      gridSize: { width: 1, height: 1 }, // Child → Parent = 2x1
    },
    connectionType: "portal",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-world-2",
    from: {
      locationId: "world-aethoria", // 50x50
      tileCoordinate: { x: 33, y: 24 }, // ตรงกลาง parent (แบ่ง space สำหรับ 2 children)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "continent-eastern", // 30x30
      tileCoordinate: { x: 14, y: 29 }, // ตรงกลางล่างสุด child (30/2 = 15)
      gridSize: { width: 1, height: 1 }, // Child → Parent = 2x1
    },
    connectionType: "portal",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 1-1: Between Continents (Sibling ↔ Sibling)
  // Pattern: entrance ชิดซ้าย/ขวา กลางแกน Y
  // continent: 30x30
  // ========================================
  {
    id: "conn-1",
    from: {
      locationId: "continent-northern", // 30x30
      tileCoordinate: { x: 29, y: 15 }, // ชิดขวา กลางแกน Y (x = 29, y = 30/2 = 15)
      gridSize: { width: 1, height: 1 }, // Sibling = 1x1
    },
    to: {
      locationId: "continent-eastern", // 30x30
      tileCoordinate: { x: 0, y: 15 }, // ชิดซ้าย กลางแกน Y (x = 0, y = 30/2 = 15)
      gridSize: { width: 1, height: 1 }, // Sibling = 1x1
    },
    connectionType: "bridge",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 1-2: Continents → Regions (Parent → Child)
  // Pattern: entrance ตรงกลาง parent, spawn ตรงกลางด้านล่าง child
  // continent: 30x30, region: 25x25
  // ========================================
  {
    id: "conn-continent-1",
    from: {
      locationId: "continent-northern", // 30x30
      tileCoordinate: { x: 15, y: 15 }, // ตรงกลาง parent (30/2 = 15)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "region-frostpeak", // 25x25
      tileCoordinate: { x: 12, y: 0 }, // ตรงกลางด้านล่าง child (25/2 = 12.5 ≈ 12, y = 0)
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-continent-2",
    from: {
      locationId: "continent-eastern", // 30x30
      tileCoordinate: { x: 15, y: 15 }, // ตรงกลาง parent (30/2 = 15)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "region-elven-forest", // 25x25
      tileCoordinate: { x: 12, y: 0 }, // ตรงกลางด้านล่าง child (25/2 = 12.5 ≈ 12, y = 0)
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 2-3: Regions → Areas/Cities (Parent → Child)
  // Pattern: entrance ตรงกลาง parent, spawn ตรงกลางด้านล่าง child
  // region: 25x25, area: 20x20, city: 20x15
  // ========================================
  {
    id: "conn-region-1",
    from: {
      locationId: "region-frostpeak", // 25x25
      tileCoordinate: { x: 12, y: 12 }, // ตรงกลาง parent (25/2 = 12.5 ≈ 12)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "area-crystal-valley", // 20x20
      tileCoordinate: { x: 10, y: 0 }, // ตรงกลางด้านล่าง child (20/2 = 10, y = 0)
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-region-2",
    from: {
      locationId: "region-elven-forest", // 25x25
      tileCoordinate: { x: 12, y: 12 }, // ตรงกลาง parent (25/2 = 12.5 ≈ 12)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "city-elvenheim", // 20x15
      tileCoordinate: { x: 10, y: 0 }, // ตรงกลางด้านล่าง child (20/2 = 10, y = 0)
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 3-4: Areas → Cities (Parent → Child)
  // Pattern: entrance ตรงกลาง parent, spawn ด้านล่างสุด child (y = rows - 1)
  // Reverse: entrance ด้านล่างสุด child, spawn ตรงกลาง parent
  // area: 20x20, city: 20x15 (rows = 15, so bottom = 14)
  // ========================================
  {
    id: "conn-area-1",
    from: {
      locationId: "area-crystal-valley", // 20x20
      tileCoordinate: { x: 10, y: 10 }, // entrance on parent (reverse spawn here)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "city-silverhold", // 20x15
      tileCoordinate: { x: 10, y: 14 }, // spawn ด้านล่างสุด child (15 - 1 = 14)
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 4-5: Cities → Buildings (Parent → Child)
  // Pattern: entrance ตรงกลาง parent, spawn ตรงกลางด้านล่าง child
  // city: 20x15, building: 15x15
  // ========================================
  {
    id: "conn-2",
    from: {
      locationId: "city-silverhold", // 20x15
      tileCoordinate: { x: 10, y: 7 }, // ตรงกลาง parent (20/2 = 10, 15/2 = 7.5 ≈ 7)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "building-guild-hall", // 15x15
      tileCoordinate: { x: 7, y: 0 }, // ตรงกลางด้านล่าง child (15/2 = 7.5 ≈ 7, y = 0)
    },
    connectionType: "entrance",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-6",
    from: {
      locationId: "city-elvenheim", // 20x15
      tileCoordinate: { x: 10, y: 7 }, // ตรงกลาง parent (20/2 = 10, 15/2 = 7.5 ≈ 7)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "building-magic-tower", // 15x15
      tileCoordinate: { x: 7, y: 0 }, // ตรงกลางด้านล่าง child (15/2 = 7.5 ≈ 7, y = 0)
    },
    connectionType: "entrance",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 5-6: Buildings → Floors (Parent → Child)
  // Pattern: entrance ตรงกลาง parent, spawn ตรงกลางด้านล่าง child
  // building: 15x15, floor: 15x10
  // ========================================
  {
    id: "conn-building-1",
    from: {
      locationId: "building-guild-hall", // 15x15
      tileCoordinate: { x: 7, y: 7 }, // ตรงกลาง parent (15/2 = 7.5 ≈ 7)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "floor-guild-1f", // 15x10
      tileCoordinate: { x: 7, y: 0 }, // ตรงกลางด้านล่าง child (15/2 = 7.5 ≈ 7, y = 0)
    },
    connectionType: "stairs",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-3",
    from: {
      locationId: "floor-guild-1f", // 15x10
      tileCoordinate: { x: 7, y: 5 }, // ตรงกลาง parent (15/2 = 7.5 ≈ 7, 10/2 = 5)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "floor-guild-2f", // 15x10
      tileCoordinate: { x: 7, y: 0 }, // ตรงกลางด้านล่าง child (15/2 = 7.5 ≈ 7, y = 0)
    },
    connectionType: "stairs",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-7",
    from: {
      locationId: "building-magic-tower", // 15x15
      tileCoordinate: { x: 7, y: 7 }, // ตรงกลาง parent (15/2 = 7.5 ≈ 7)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "floor-tower-1f", // 12x12
      tileCoordinate: { x: 6, y: 0 }, // ตรงกลางด้านล่าง child (12/2 = 6, y = 0)
    },
    connectionType: "stairs",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 6-7: Floors → Rooms (Parent → Child, Multiple Children)
  // Pattern: entrance ตรงกลาง parent (แบ่งตามจำนวน children), spawn ตรงกลางด้านล่าง child
  // floor: 15x10, room-guild-master: 10x8, room-meeting: 8x8
  // floor-guild-2f มี 2 children: แบ่ง x เป็น 1/3 และ 2/3
  // ========================================
  {
    id: "conn-4",
    from: {
      locationId: "floor-guild-2f", // 15x10, มี 2 children
      tileCoordinate: { x: 5, y: 5 }, // 1/3 ของ width (15/3 = 5), กลาง Y (10/2 = 5)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "room-guild-master", // 10x8
      tileCoordinate: { x: 5, y: 0 }, // ตรงกลางด้านล่าง child (10/2 = 5, y = 0)
    },
    connectionType: "door",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-5",
    from: {
      locationId: "floor-guild-2f", // 15x10, มี 2 children
      tileCoordinate: { x: 10, y: 5 }, // 2/3 ของ width (15*2/3 = 10), กลาง Y (10/2 = 5)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "room-meeting-1", // 8x8
      tileCoordinate: { x: 4, y: 0 }, // ตรงกลางด้านล่าง child (8/2 = 4, y = 0)
    },
    connectionType: "door",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // DUNGEONS (Parent → Child)
  // Pattern: entrance ตรงกลาง parent, spawn ตรงกลางด้านล่าง child
  // area: 20x20, dungeon: 25x25
  // ========================================
  {
    id: "conn-8",
    from: {
      locationId: "area-crystal-valley", // 20x20
      tileCoordinate: { x: 10, y: 10 }, // ตรงกลาง parent (20/2 = 10)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "dungeon-frozen-depths", // 25x25
      tileCoordinate: { x: 12, y: 0 }, // ตรงกลางด้านล่าง child (25/2 = 12.5 ≈ 12, y = 0)
    },
    connectionType: "entrance",
    isLocked: true,
    requiredItemId: "item-crystal-key",
    isTwoWay: true,
  },

  // ========================================
  // ADDITIONAL CONNECTIONS (Parent → Child)
  // Pattern: entrance ตรงกลาง parent, spawn = entrance position
  // continent: 30x30, field: 30x25, town: 18x15
  // ========================================
  {
    id: "conn-9",
    from: {
      locationId: "continent-northern", // 30x30
      tileCoordinate: { x: 15, y: 15 }, // ตรงกลาง parent (30/2 = 15)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "field-starting-plains", // 30x25
      tileCoordinate: { x: 15, y: 15 }, // spawn ตำแหน่งเดียวกับ entrance
    },
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-10",
    from: {
      locationId: "continent-eastern", // 30x30
      tileCoordinate: { x: 15, y: 15 }, // ตรงกลาง parent (30/2 = 15)
      gridSize: { width: 1, height: 1 }, // Parent → Child = 1x1
    },
    to: {
      locationId: "town-riverside", // 18x15
      tileCoordinate: { x: 15, y: 15 }, // spawn ตำแหน่งเดียวกับ entrance
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
  return LOCATIONS_MASTER.find((loc: Location) => loc.id === id);
}

/**
 * Get children of a location
 */
export function getLocationChildren(parentId: string): Location[] {
  return LOCATIONS_MASTER.filter((loc: Location) => loc.parentId === parentId);
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
export function getLocationConnections(
  locationId: string
): LocationConnection[] {
  return LOCATION_CONNECTIONS_MASTER.filter(
    (conn) =>
      conn.from.locationId === locationId || conn.to.locationId === locationId
  );
}

// Export hierarchical tree
export const LOCATION_TREE_MASTER = buildLocationTree(LOCATIONS_MASTER);

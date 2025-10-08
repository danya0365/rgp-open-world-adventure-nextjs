import { Location, LocationConnection } from "@/src/domain/types/location.types";

/**
 * Master Data: Hierarchical World Map
 * Structure: World → Continent → Region → Area → City → Building → Floor → Room
 */

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
      width: 1000,
      height: 1000,
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
    coordinates: { x: 200, y: 100 },
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: true,
    currentWeather: "snow",
    timeEnabled: true,
    mapData: {
      width: 400,
      height: 400,
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
    coordinates: { x: 600, y: 300 },
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: true,
    currentWeather: "sunny",
    timeEnabled: true,
    mapData: {
      width: 400,
      height: 400,
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
    coordinates: { x: 150, y: 80 },
    isDiscoverable: true,
    isFastTravelPoint: false,
    requiredLevel: 10,
    weatherEnabled: true,
    currentWeather: "snow",
    timeEnabled: true,
    backgroundMusic: "/audio/bgm/frostpeak.mp3",
    ambientSound: "/audio/ambient/wind.mp3",
    mapData: {
      width: 200,
      height: 200,
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
    coordinates: { x: 500, y: 250 },
    isDiscoverable: true,
    isFastTravelPoint: false,
    requiredLevel: 5,
    weatherEnabled: true,
    currentWeather: "sunny",
    timeEnabled: true,
    backgroundMusic: "/audio/bgm/elven-forest.mp3",
    ambientSound: "/audio/ambient/forest.mp3",
    mapData: {
      width: 200,
      height: 200,
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
    coordinates: { x: 120, y: 60 },
    isDiscoverable: true,
    isFastTravelPoint: true,
    requiredLevel: 15,
    weatherEnabled: true,
    currentWeather: "clear",
    timeEnabled: true,
    encounterTableId: "encounter-ice-monsters",
    mapData: {
      width: 100,
      height: 100,
    },
    metadata: {
      encounters: ["ice-wolf", "frost-giant", "ice-elemental"],
      treasures: ["crystal-chest-1", "crystal-chest-2"],
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
    coordinates: { x: 100, y: 50 },
    isDiscoverable: true,
    isFastTravelPoint: true,
    requiredLevel: 10,
    weatherEnabled: true,
    currentWeather: "snow",
    timeEnabled: true,
    backgroundMusic: "/audio/bgm/city-theme.mp3",
    ambientSound: "/audio/ambient/city.mp3",
    mapData: {
      width: 80,
      height: 80,
    },
    metadata: {
      npcs: ["npc-mayor", "npc-blacksmith", "npc-merchant"],
      battleMaps: ["map-forest-clearing", "map-cave-entrance"],
      shops: ["shop-weapons", "shop-armor", "shop-items"],
      services: ["inn", "guild", "bank"],
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
    coordinates: { x: 480, y: 230 },
    isDiscoverable: true,
    isFastTravelPoint: true,
    requiredLevel: 5,
    weatherEnabled: true,
    currentWeather: "sunny",
    timeEnabled: true,
    backgroundMusic: "/audio/bgm/elven-city.mp3",
    ambientSound: "/audio/ambient/nature.mp3",
    mapData: {
      width: 100,
      height: 100,
    },
    metadata: {
      npcs: ["npc-elder", "npc-archer-trainer", "npc-herbalist"],
      shops: ["shop-magic", "shop-bows", "shop-potions"],
      services: ["inn", "guild", "temple"],
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
    coordinates: { x: 90, y: 45 },
    isDiscoverable: true,
    isFastTravelPoint: true,
    weatherEnabled: false,
    timeEnabled: false,
    backgroundMusic: "/audio/bgm/guild.mp3",
    mapData: {
      width: 30,
      height: 30,
    },
    metadata: {
      npcs: ["npc-guild-master", "npc-receptionist", "npc-quest-board"],
      services: ["quest-board", "party-formation", "bounties"],
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
    coordinates: { x: 470, y: 220 },
    isDiscoverable: true,
    isFastTravelPoint: true,
    requiredLevel: 10,
    weatherEnabled: false,
    timeEnabled: false,
    backgroundMusic: "/audio/bgm/magic-tower.mp3",
    mapData: {
      width: 20,
      height: 20,
    },
    metadata: {
      npcs: ["npc-archmage", "npc-librarian", "npc-apprentice"],
      services: ["spell-learning", "enchanting", "library"],
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
      width: 30,
      height: 15,
    },
    metadata: {
      npcs: ["npc-receptionist", "npc-quest-board"],
      services: ["quest-board", "registration"],
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
      width: 30,
      height: 15,
    },
    metadata: {
      npcs: ["npc-party-leader"],
      services: ["party-formation", "strategy-planning"],
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
      width: 20,
      height: 20,
    },
    metadata: {
      npcs: ["npc-librarian"],
      services: ["library", "spell-research"],
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
    coordinates: { x: 25, y: 10 },
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: false,
    timeEnabled: false,
    mapData: {
      width: 10,
      height: 8,
    },
    metadata: {
      npcs: ["npc-guild-master"],
      services: ["special-quests", "rank-promotion"],
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
    coordinates: { x: 15, y: 10 },
    isDiscoverable: true,
    isFastTravelPoint: false,
    weatherEnabled: false,
    timeEnabled: false,
    mapData: {
      width: 8,
      height: 8,
    },
    metadata: {
      services: ["party-formation"],
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
    coordinates: { x: 110, y: 70 },
    isDiscoverable: true,
    isFastTravelPoint: false,
    requiredLevel: 20,
    weatherEnabled: false,
    timeEnabled: false,
    backgroundMusic: "/audio/bgm/dungeon.mp3",
    ambientSound: "/audio/ambient/dungeon.mp3",
    encounterTableId: "encounter-frozen-depths",
    mapData: {
      width: 50,
      height: 50,
    },
    metadata: {
      encounters: ["ice-golem", "frost-dragon", "frozen-undead"],
      treasures: ["legendary-chest-1"],
      secrets: ["secret-boss-room"],
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
    fromLocationId: "world-aethoria",
    toLocationId: "continent-northern",
    connectionType: "portal",
    isLocked: false,
    isTwoWay: true,
    coordinates: { x: 200, y: 100 },
  },

  {
    id: "conn-world-2",
    fromLocationId: "world-aethoria",
    toLocationId: "continent-eastern",
    connectionType: "portal",
    isLocked: false,
    isTwoWay: true,
    coordinates: { x: 600, y: 300 },
  },

  // ========================================
  // LEVEL 1-1: Between Continents
  // ========================================
  {
    id: "conn-1",
    fromLocationId: "continent-northern",
    toLocationId: "continent-eastern",
    connectionType: "bridge",
    isLocked: false,
    isTwoWay: true,
    coordinates: { x: 400, y: 200 },
  },

  // ========================================
  // LEVEL 1-2: Continents → Regions
  // ========================================
  {
    id: "conn-continent-1",
    fromLocationId: "continent-northern",
    toLocationId: "region-frostpeak",
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
    coordinates: { x: 150, y: 80 },
  },

  {
    id: "conn-continent-2",
    fromLocationId: "continent-eastern",
    toLocationId: "region-elven-forest",
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
    coordinates: { x: 500, y: 250 },
  },

  // ========================================
  // LEVEL 2-3: Regions → Areas/Cities
  // ========================================
  {
    id: "conn-region-1",
    fromLocationId: "region-frostpeak",
    toLocationId: "area-crystal-valley",
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
    coordinates: { x: 120, y: 60 },
  },

  {
    id: "conn-region-2",
    fromLocationId: "region-elven-forest",
    toLocationId: "city-elvenheim",
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
    coordinates: { x: 480, y: 230 },
  },

  // ========================================
  // LEVEL 3-4: Areas → Cities
  // ========================================
  {
    id: "conn-area-1",
    fromLocationId: "area-crystal-valley",
    toLocationId: "city-silverhold",
    connectionType: "gate",
    isLocked: false,
    isTwoWay: true,
    coordinates: { x: 100, y: 50 },
  },

  // ========================================
  // LEVEL 4-5: Cities → Buildings
  // ========================================
  {
    id: "conn-2",
    fromLocationId: "city-silverhold",
    toLocationId: "building-guild-hall",
    connectionType: "entrance",
    isLocked: false,
    isTwoWay: true,
    coordinates: { x: 90, y: 45 },
  },

  {
    id: "conn-6",
    fromLocationId: "city-elvenheim",
    toLocationId: "building-magic-tower",
    connectionType: "entrance",
    isLocked: false,
    isTwoWay: true,
    coordinates: { x: 470, y: 220 },
  },

  // ========================================
  // LEVEL 5-6: Buildings → Floors
  // ========================================
  {
    id: "conn-building-1",
    fromLocationId: "building-guild-hall",
    toLocationId: "floor-guild-1f",
    connectionType: "stairs",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-3",
    fromLocationId: "floor-guild-1f",
    toLocationId: "floor-guild-2f",
    connectionType: "stairs",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-7",
    fromLocationId: "building-magic-tower",
    toLocationId: "floor-tower-1f",
    connectionType: "stairs",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // LEVEL 6-7: Floors → Rooms
  // ========================================
  {
    id: "conn-4",
    fromLocationId: "floor-guild-2f",
    toLocationId: "room-guild-master",
    connectionType: "door",
    isLocked: false,
    isTwoWay: true,
  },

  {
    id: "conn-5",
    fromLocationId: "floor-guild-2f",
    toLocationId: "room-meeting-1",
    connectionType: "door",
    isLocked: false,
    isTwoWay: true,
  },

  // ========================================
  // DUNGEONS
  // ========================================
  {
    id: "conn-8",
    fromLocationId: "area-crystal-valley",
    toLocationId: "dungeon-frozen-depths",
    connectionType: "entrance",
    isLocked: true,
    requiredItemId: "item-crystal-key",
    isTwoWay: true,
    coordinates: { x: 110, y: 70 },
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
    (conn) => conn.fromLocationId === locationId || conn.toLocationId === locationId
  );
}

// Export hierarchical tree
export const LOCATION_TREE_MASTER = buildLocationTree(LOCATIONS_MASTER);

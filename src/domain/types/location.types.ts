/**
 * Location Types for Hierarchical World Map
 * Supports unlimited nesting: World → Continent → Region → Area → City → Building → Floor → Room
 */

export type LocationType =
  | "world"
  | "continent"
  | "region"
  | "area"
  | "city"
  | "town"
  | "village"
  | "building"
  | "floor"
  | "room"
  | "dungeon"
  | "field"
  | "forest"
  | "mountain"
  | "cave"
  | "castle"
  | "temple"
  | "tower";

export type ConnectionType =
  | "entrance"
  | "exit"
  | "portal"
  | "stairs"
  | "ladder"
  | "door"
  | "gate"
  | "bridge"
  | "teleport";

export type WeatherType = "sunny" | "rain" | "snow" | "storm" | "fog" | "clear";

export type TerrainType =
  | "grass"
  | "water"
  | "mountain"
  | "sand"
  | "snow"
  | "lava"
  | "ice"
  | "forest"
  | "swamp"
  | "desert";

export interface Coordinates {
  x: number;
  y: number;
}

export interface MapData {
  width: number;
  height: number;
  gridSize?: number;
  tiles?: MapTile[];
  boundaries?: Coordinates[];
}

export interface MapTile {
  x: number;
  y: number;
  type: TerrainType;
  isWalkable: boolean;
  height: number;
  data?: Record<string, any>;
}

export interface LocationMetadata {
  npcs?: string[]; // NPC IDs
  shops?: string[]; // Shop IDs
  services?: string[]; // Service types
  exits?: LocationConnection[];
  encounters?: string[]; // Encounter table IDs
  treasures?: string[]; // Treasure IDs
  secrets?: string[]; // Secret IDs
}

export interface LocationConnection {
  id: string;
  fromLocationId: string;
  toLocationId: string;
  connectionType: ConnectionType;
  isLocked: boolean;
  requiredItemId?: string;
  isTwoWay: boolean;
  coordinates?: Coordinates;
}

export interface Location {
  id: string;
  parentId: string | null;
  name: string;
  nameEn?: string;
  type: LocationType;
  level: number; // Depth level (0 = world, 1 = continent, etc.)
  path: string[]; // Full path array
  slug: string;
  description: string;
  coordinates?: Coordinates;
  mapData?: MapData;
  isDiscoverable: boolean;
  isFastTravelPoint: boolean;
  requiredLevel?: number;
  requiredQuestId?: string;
  weatherEnabled: boolean;
  currentWeather?: WeatherType;
  timeEnabled: boolean;
  encounterTableId?: string;
  backgroundMusic?: string;
  ambientSound?: string;
  metadata?: LocationMetadata;
  children?: Location[]; // Child locations for hierarchical structure
  createdAt?: string;
  updatedAt?: string;
}

export interface PlayerLocationDiscovery {
  characterId: string;
  locationId: string;
  discoveredAt: string;
  completionPercentage: number;
  secretsFound: number;
}

export interface FogOfWar {
  characterId: string;
  locationId: string;
  revealedTiles: Coordinates[];
}

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
  dimensions: {
    columns: number; // Number of tiles horizontally
    rows: number; // Number of tiles vertically
  };
  tileSize: number; // Size of each tile in pixels (e.g., 40px)
  tiles?: MapTile[];
  boundaries?: Coordinates[];
}

export interface MapTile {
  x: number;
  y: number;
  type: TerrainType;
  isWalkable: boolean;
  height: number;
  data?: Record<string, unknown>;
}

// POI (Point of Interest) Types
export interface POIGridSize {
  width: number; // Number of tiles horizontally (default: 1)
  height: number; // Number of tiles vertically (default: 1)
}

export interface POIBase {
  id: string;
  tileCoordinate: Coordinates; // Position on the map grid (top-left corner of POI) - TILE units
  name?: string; // Optional display name
  icon?: string; // Optional icon identifier
  gridSize?: POIGridSize; // Size in tiles (default: { width: 1, height: 1 })
}

export interface NPCMarker extends POIBase {
  hasQuest?: boolean; // Does this NPC have a quest?
  questId?: string; // Quest ID if available
}

export interface ShopMarker extends POIBase {
  shopType?: "weapons" | "armor" | "items" | "magic" | "potions" | "general";
}

export interface ServiceMarker extends POIBase {
  serviceType:
    | "inn"
    | "guild"
    | "bank"
    | "temple"
    | "blacksmith"
    | "quest-board"
    | "party-formation"
    | "bounties";
}

export interface TreasureMarker extends POIBase {
  treasureId: string;
  isDiscovered?: boolean;
}

export interface LocationMetadata {
  npcs?: NPCMarker[]; // NPCs with positions
  shops?: ShopMarker[]; // Shops with positions
  services?: ServiceMarker[]; // Services with positions
  treasures?: TreasureMarker[]; // Treasure chests with positions
  encounters?: string[]; // Random encounter table IDs
  secrets?: string[]; // Secret area IDs
  exits?: LocationConnection[]; // Deprecated: use LOCATION_CONNECTIONS instead
}

export interface LocationConnection {
  id: string;
  from: {
    locationId: string;
    tileCoordinate: Coordinates; // Position on parent map where entrance appears - TILE units
    gridSize?: POIGridSize; // Size of entrance marker on parent map (default: 1x1)
  };
  to: {
    locationId: string;
    tileCoordinate: Coordinates; // Position on child map where player spawns - TILE units
    gridSize?: POIGridSize; // Size of entrance marker on child map (default: 1x1)
  };
  connectionType: ConnectionType;
  isLocked: boolean;
  requiredItemId?: string;
  isTwoWay: boolean;
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
  // ❌ Removed: coordinates - Use LocationConnection instead
  mapData?: MapData;
  isDiscoverable: boolean;
  isFastTravelPoint: boolean;
  requiredLevel?: number;
  requiredQuestId?: string;
  weatherEnabled: boolean;
  currentWeather?: WeatherType;
  timeEnabled: boolean;
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

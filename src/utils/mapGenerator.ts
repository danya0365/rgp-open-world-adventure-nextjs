import { MapTile, TerrainType } from "@/src/domain/types/location.types";

/**
 * Generate default tiles for a map
 * Used when location.mapData.tiles is not defined
 */
export function generateDefaultTiles(
  width: number,
  height: number,
  terrainType: TerrainType = "grass"
): MapTile[] {
  const tiles: MapTile[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      tiles.push({
        x,
        y,
        type: terrainType,
        isWalkable: true,
        height: 0,
      });
    }
  }

  return tiles;
}

/**
 * Generate procedural map with varied terrain
 */
export function generateProceduralMap(
  width: number,
  height: number,
  seed?: number
): MapTile[] {
  const tiles: MapTile[] = [];
  const random = seed ? seededRandom(seed) : Math.random;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Simple noise-based terrain generation
      const noise = random();
      
      let type: TerrainType = "grass";
      let isWalkable = true;
      let height = 0;

      if (noise < 0.1) {
        type = "water";
        isWalkable = false;
      } else if (noise < 0.2) {
        type = "forest";
        height = 1;
      } else if (noise < 0.3) {
        type = "mountain";
        isWalkable = false;
        height = 2;
      } else if (noise < 0.4) {
        type = "sand";
      } else {
        type = "grass";
      }

      tiles.push({
        x,
        y,
        type,
        isWalkable,
        height,
      });
    }
  }

  return tiles;
}

/**
 * Seeded random number generator
 */
function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * Get tile at specific coordinates
 */
export function getTileAt(
  tiles: MapTile[],
  x: number,
  y: number
): MapTile | undefined {
  return tiles.find((tile) => tile.x === x && tile.y === y);
}

/**
 * Check if tile is walkable
 */
export function isTileWalkable(
  tiles: MapTile[],
  x: number,
  y: number
): boolean {
  const tile = getTileAt(tiles, x, y);
  return tile?.isWalkable ?? false;
}

/**
 * Get neighbors of a tile (4-directional)
 */
export function getTileNeighbors(
  tiles: MapTile[],
  x: number,
  y: number
): MapTile[] {
  const neighbors: MapTile[] = [];
  const directions = [
    { dx: 0, dy: -1 }, // North
    { dx: 1, dy: 0 },  // East
    { dx: 0, dy: 1 },  // South
    { dx: -1, dy: 0 }, // West
  ];

  for (const { dx, dy } of directions) {
    const tile = getTileAt(tiles, x + dx, y + dy);
    if (tile) neighbors.push(tile);
  }

  return neighbors;
}

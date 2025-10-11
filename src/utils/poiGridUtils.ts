import { POIGridSize } from "@/src/domain/types/location.types";

/**
 * Get POI marker dimensions in pixels based on grid size
 * @param poiGridSize - POI grid size in tiles
 * @param tileSize - Size of one tile in pixels (default: 40)
 * @returns Width and height in pixels
 */
export function getPOIPixelSize(
  poiGridSize: POIGridSize | undefined,
  tileSize: number = 40
): { width: number; height: number } {
  const defaultSize = { width: 1, height: 1 };
  const size = poiGridSize || defaultSize;

  return {
    width: size.width * tileSize,
    height: size.height * tileSize,
  };
}

/**
 * Get default grid size for POI marker (1x1 tile)
 */
export function getDefaultPOIGridSize(): POIGridSize {
  return { width: 1, height: 1 };
}

/**
 * Check if tile coordinates are within POI bounds
 * @param poiTileCoordinate - Top-left corner of POI in TILE units
 * @param poiGridSize - Size of POI in tiles
 * @param targetTileCoordinate - Tile coordinates to check (TILE units)
 * @returns true if coordinates are within POI bounds
 */
export function isWithinPOIBounds(
  poiTileCoordinate: { x: number; y: number },
  poiGridSize: POIGridSize | undefined,
  targetTileCoordinate: { x: number; y: number }
): boolean {
  const size = poiGridSize || getDefaultPOIGridSize();

  return (
    targetTileCoordinate.x >= poiTileCoordinate.x &&
    targetTileCoordinate.x < poiTileCoordinate.x + size.width &&
    targetTileCoordinate.y >= poiTileCoordinate.y &&
    targetTileCoordinate.y < poiTileCoordinate.y + size.height
  );
}

/**
 * Get center coordinates of POI in tiles
 * @param poiTileCoordinate - Top-left corner of POI in TILE units
 * @param poiGridSize - Size of POI in tiles
 * @returns Center coordinates in TILE units
 */
export function getPOICenterCoords(
  poiTileCoordinate: { x: number; y: number },
  poiGridSize: POIGridSize | undefined
): { x: number; y: number } {
  const size = poiGridSize || getDefaultPOIGridSize();

  return {
    x: poiTileCoordinate.x + size.width / 2,
    y: poiTileCoordinate.y + size.height / 2,
  };
}

/**
 * Get all tile coordinates occupied by POI
 * @param poiTileCoordinate - Top-left corner of POI in TILE units
 * @param poiGridSize - Size of POI in tiles
 * @returns Array of all tile coordinates (TILE units) occupied by POI
 */
export function getPOITileCoordinates(
  poiTileCoordinate: { x: number; y: number },
  poiGridSize: POIGridSize | undefined
): Array<{ x: number; y: number }> {
  const size = poiGridSize || getDefaultPOIGridSize();
  const tiles: Array<{ x: number; y: number }> = [];

  for (let y = poiTileCoordinate.y; y < poiTileCoordinate.y + size.height; y++) {
    for (let x = poiTileCoordinate.x; x < poiTileCoordinate.x + size.width; x++) {
      tiles.push({ x, y });
    }
  }

  return tiles;
}

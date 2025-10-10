import { POIGridSize } from "@/src/domain/types/location.types";

/**
 * Get POI marker dimensions in pixels based on grid size
 * @param gridSize - POI grid size (tiles)
 * @param tileSize - Size of one tile in pixels (default: 40)
 * @returns Width and height in pixels
 */
export function getPOIPixelSize(
  gridSize: POIGridSize | undefined,
  tileSize: number = 40
): { width: number; height: number } {
  const defaultSize = { width: 1, height: 1 };
  const size = gridSize || defaultSize;

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
 * Check if coordinates are within POI bounds
 * @param poiCoords - Top-left corner of POI
 * @param poiGridSize - Size of POI in tiles
 * @param checkCoords - Coordinates to check
 * @returns true if coordinates are within POI bounds
 */
export function isWithinPOIBounds(
  poiCoords: { x: number; y: number },
  poiGridSize: POIGridSize | undefined,
  checkCoords: { x: number; y: number }
): boolean {
  const size = poiGridSize || getDefaultPOIGridSize();

  return (
    checkCoords.x >= poiCoords.x &&
    checkCoords.x < poiCoords.x + size.width &&
    checkCoords.y >= poiCoords.y &&
    checkCoords.y < poiCoords.y + size.height
  );
}

/**
 * Get center coordinates of POI in tiles
 */
export function getPOICenterCoords(
  poiCoords: { x: number; y: number },
  poiGridSize: POIGridSize | undefined
): { x: number; y: number } {
  const size = poiGridSize || getDefaultPOIGridSize();

  return {
    x: poiCoords.x + size.width / 2,
    y: poiCoords.y + size.height / 2,
  };
}

/**
 * Get all tile coordinates occupied by POI
 */
export function getPOITileCoordinates(
  poiCoords: { x: number; y: number },
  poiGridSize: POIGridSize | undefined
): Array<{ x: number; y: number }> {
  const size = poiGridSize || getDefaultPOIGridSize();
  const tiles: Array<{ x: number; y: number }> = [];

  for (let y = poiCoords.y; y < poiCoords.y + size.height; y++) {
    for (let x = poiCoords.x; x < poiCoords.x + size.width; x++) {
      tiles.push({ x, y });
    }
  }

  return tiles;
}

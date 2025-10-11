/**
 * Grid/Tile Configuration Constants
 */
export const GRID_CONFIG = {
  /** Size of one tile in pixels */
  TILE_SIZE: 40,

  /** Default viewport size in tiles */
  DEFAULT_VIEWPORT_WIDTH: 20,
  DEFAULT_VIEWPORT_HEIGHT: 15,
} as const;

/**
 * Utility: Convert tile coordinate to pixel coordinate
 */
export function tileToPixel(tileValue: number): number {
  return tileValue * GRID_CONFIG.TILE_SIZE;
}

/**
 * Utility: Convert pixel coordinate to tile coordinate (floor)
 */
export function pixelToTile(pixelValue: number): number {
  return Math.floor(pixelValue / GRID_CONFIG.TILE_SIZE);
}

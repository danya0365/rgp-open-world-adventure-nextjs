import { MapTile } from "@/src/domain/types/location.types";

/**
 * A* Pathfinding Algorithm
 * Finds the shortest path between two tiles on a grid
 */

interface PathNode {
  x: number;
  y: number;
  g: number; // Cost from start
  h: number; // Heuristic (estimated cost to end)
  f: number; // Total cost (g + h)
  parent: PathNode | null;
}

/**
 * Manhattan distance heuristic (4-directional movement)
 */
function manhattanDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/**
 * Get walkable neighbors (4-directional: North, East, South, West)
 */
function getWalkableNeighbors(
  node: PathNode,
  tiles: MapTile[],
  mapWidth: number,
  mapHeight: number
): PathNode[] {
  const neighbors: PathNode[] = [];
  const directions = [
    { dx: 0, dy: -1 }, // North
    { dx: 1, dy: 0 },  // East
    { dx: 0, dy: 1 },  // South
    { dx: -1, dy: 0 }, // West
  ];

  for (const { dx, dy } of directions) {
    const nx = node.x + dx;
    const ny = node.y + dy;

    // Check bounds
    if (nx < 0 || nx >= mapWidth || ny < 0 || ny >= mapHeight) {
      continue;
    }

    // Find tile at this position
    const tile = tiles.find((t) => t.x === nx && t.y === ny);
    
    // Check if walkable
    if (tile && tile.isWalkable) {
      neighbors.push({
        x: nx,
        y: ny,
        g: 0,
        h: 0,
        f: 0,
        parent: null,
      });
    }
  }

  return neighbors;
}

/**
 * Reconstruct path from end node to start
 */
function reconstructPath(endNode: PathNode): PathNode[] {
  const path: PathNode[] = [];
  let current: PathNode | null = endNode;

  while (current !== null) {
    path.unshift(current);
    current = current.parent;
  }

  return path;
}

/**
 * A* Pathfinding
 * Returns array of tiles from start to end (including start and end)
 * Returns empty array if no path found
 */
export function findPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  tiles: MapTile[],
  mapWidth: number,
  mapHeight: number
): { x: number; y: number }[] {
  // If start or end is out of bounds, return empty
  if (startX < 0 || startX >= mapWidth || startY < 0 || startY >= mapHeight) {
    return [];
  }
  if (endX < 0 || endX >= mapWidth || endY < 0 || endY >= mapHeight) {
    return [];
  }

  // If start === end, return just start
  if (startX === endX && startY === endY) {
    return [{ x: startX, y: startY }];
  }

  // Check if end tile is walkable
  const endTile = tiles.find((t) => t.x === endX && t.y === endY);
  if (!endTile || !endTile.isWalkable) {
    return []; // Can't walk to blocked tile
  }

  // Initialize start node
  const startNode: PathNode = {
    x: startX,
    y: startY,
    g: 0,
    h: manhattanDistance(startX, startY, endX, endY),
    f: 0,
    parent: null,
  };
  startNode.f = startNode.g + startNode.h;

  // Open and closed sets
  const openSet: PathNode[] = [startNode];
  const closedSet = new Set<string>();

  // Helper to get node key
  const getKey = (x: number, y: number) => `${x},${y}`;

  while (openSet.length > 0) {
    // Get node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;

    // Check if we reached the goal
    if (current.x === endX && current.y === endY) {
      const path = reconstructPath(current);
      return path.map((node) => ({ x: node.x, y: node.y }));
    }

    // Add to closed set
    closedSet.add(getKey(current.x, current.y));

    // Check neighbors
    const neighbors = getWalkableNeighbors(current, tiles, mapWidth, mapHeight);

    for (const neighbor of neighbors) {
      const neighborKey = getKey(neighbor.x, neighbor.y);

      // Skip if already evaluated
      if (closedSet.has(neighborKey)) {
        continue;
      }

      // Calculate g score (cost from start)
      const tentativeG = current.g + 1; // Cost = 1 per tile

      // Check if this path to neighbor is better
      const existingInOpen = openSet.find(
        (n) => n.x === neighbor.x && n.y === neighbor.y
      );

      if (!existingInOpen || tentativeG < existingInOpen.g) {
        // Update neighbor
        neighbor.g = tentativeG;
        neighbor.h = manhattanDistance(neighbor.x, neighbor.y, endX, endY);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;

        if (!existingInOpen) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // No path found
  return [];
}

/**
 * Check if path exists (faster than finding full path)
 */
export function hasPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  tiles: MapTile[],
  mapWidth: number,
  mapHeight: number
): boolean {
  const path = findPath(startX, startY, endX, endY, tiles, mapWidth, mapHeight);
  return path.length > 0;
}

/**
 * Get distance of path (number of tiles)
 */
export function getPathDistance(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  tiles: MapTile[],
  mapWidth: number,
  mapHeight: number
): number {
  const path = findPath(startX, startY, endX, endY, tiles, mapWidth, mapHeight);
  return path.length;
}

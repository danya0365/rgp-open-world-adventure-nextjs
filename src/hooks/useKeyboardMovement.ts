import { useVirtualMapStore } from "@/src/stores/virtualMapStore";
import { useCallback, useEffect, useRef } from "react";

/**
 * Hook for keyboard-based player movement
 * Supports WASD and Arrow Keys
 * Hold key = continuous movement
 */
export function useKeyboardMovement(enabled: boolean = true) {
  const {
    playerPosition,
    startMovementToTile,
    movementState,
    currentLocationData,
  } = useVirtualMapStore();
  const keysPressed = useRef<Set<string>>(new Set());
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate target tile based on pressed keys
  const calculateTargetTile = useCallback(() => {
    const gridSize = 40;
    const currentTileX = Math.floor(playerPosition.coordinates.x / gridSize);
    const currentTileY = Math.floor(playerPosition.coordinates.y / gridSize);

    let dx = 0;
    let dy = 0;

    // Check which keys are pressed
    if (keysPressed.current.has("w") || keysPressed.current.has("arrowup")) {
      dy = -1; // North
    }
    if (keysPressed.current.has("s") || keysPressed.current.has("arrowdown")) {
      dy = 1; // South
    }
    if (keysPressed.current.has("a") || keysPressed.current.has("arrowleft")) {
      dx = -1; // West
    }
    if (keysPressed.current.has("d") || keysPressed.current.has("arrowright")) {
      dx = 1; // East
    }

    console.log("  - Direction:", { dx, dy });

    // Prioritize vertical movement if both pressed
    if (dx !== 0 && dy !== 0) {
      dx = 0; // Only move vertically if both directions pressed
    }

    if (dx === 0 && dy === 0) {
      return null; // No movement
    }

    const target = {
      x: currentTileX + dx,
      y: currentTileY + dy,
    };
    return target;
  }, [playerPosition.coordinates]);

  // Handle movement based on pressed keys
  const handleMovement = useCallback(() => {
    // Don't move if already moving
    if (movementState.isMoving) {
      return;
    }

    const target = calculateTargetTile();
    if (!target) return;

    // Check if player is in a location with map data
    if (!currentLocationData?.mapData?.tiles) {
      console.log("  - No tiles data available!");
      console.log("  - currentLocationData:", currentLocationData?.id);
      console.log("  - Has mapData:", !!currentLocationData?.mapData);
      console.log("  - Has tiles:", !!currentLocationData?.mapData?.tiles);
      return;
    }

    const mapWidth =
      currentLocationData.mapData.gridSize ||
      currentLocationData.mapData.width ||
      20;
    const mapHeight =
      currentLocationData.mapData.gridSize ||
      currentLocationData.mapData.height ||
      15;

    // Check bounds
    if (
      target.x < 0 ||
      target.x >= mapWidth ||
      target.y < 0 ||
      target.y >= mapHeight
    ) {
      return;
    }

    // Start movement to target tile
    startMovementToTile(target.x, target.y);
  }, [
    calculateTargetTile,
    movementState.isMoving,
    currentLocationData,
    startMovementToTile,
  ]);

  // Handle keydown
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const key = e.key.toLowerCase();
      const validKeys = [
        "w",
        "a",
        "s",
        "d",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
      ];

      if (validKeys.includes(key)) {
        e.preventDefault(); // Prevent page scroll

        // Add key to pressed set
        if (!keysPressed.current.has(key)) {
          keysPressed.current.add(key);

          // Start movement immediately
          handleMovement();

          // Start continuous movement interval
          if (moveIntervalRef.current === null) {
            moveIntervalRef.current = setInterval(() => {
              handleMovement();
            }, 100); // Check every 100ms for continuous movement
          }
        }
      }
    },
    [enabled, handleMovement]
  );

  // Handle keyup
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;

      const key = e.key.toLowerCase();
      keysPressed.current.delete(key);

      // Stop interval if no keys pressed
      if (keysPressed.current.size === 0 && moveIntervalRef.current !== null) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
    },
    [enabled]
  );

  // Setup keyboard listeners
  useEffect(() => {
    if (!enabled) return;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);

      // Cleanup interval
      if (moveIntervalRef.current !== null) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
      keysPressed.current.clear();
    };
  }, [enabled, handleKeyDown, handleKeyUp]);

  // Return current pressed keys (for debug/UI)
  return {
    keysPressed: Array.from(keysPressed.current),
  };
}

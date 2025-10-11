import { useVirtualMapStore } from "@/src/stores/virtualMapStore";
import { useEffect, useRef } from "react";

/**
 * Hook to animate player movement
 * Uses requestAnimationFrame for smooth 60fps animation
 */
export function useMovementAnimation() {
  const { movementState, updateMovement } = useVirtualMapStore();
  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!movementState.isMoving) {
      // Cancel animation if not moving
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    // Start animation loop
    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = (currentTime - lastTimeRef.current) / 100; // Convert to seconds
      lastTimeRef.current = currentTime;

      // Update movement
      updateMovement(deltaTime);

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start first frame
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      lastTimeRef.current = 0;
    };
  }, [movementState.isMoving, updateMovement]);
}

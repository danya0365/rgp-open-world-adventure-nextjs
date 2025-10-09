import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Location,
  NPCMarker,
  ShopMarker,
  ServiceMarker,
  BattleMarker,
  TreasureMarker,
} from "@/src/domain/types/location.types";
import { useVirtualMapStore } from "@/src/stores/virtualMapStore";

interface POIAtPlayerPosition {
  type: "npc" | "shop" | "service" | "battle" | "treasure" | null;
  data: NPCMarker | ShopMarker | ServiceMarker | BattleMarker | TreasureMarker | null;
}

export function usePOIInteraction(currentLocation: Location, gridSize: number) {
  const router = useRouter();
  const { playerPosition } = useVirtualMapStore();
  const [currentPOI, setCurrentPOI] = useState<POIAtPlayerPosition>({
    type: null,
    data: null,
  });

  // Check if player is at any POI
  useEffect(() => {
    if (playerPosition.locationId !== currentLocation.id) {
      setCurrentPOI({ type: null, data: null });
      return;
    }

    const playerTileX = Math.floor(playerPosition.coordinates.x / gridSize);
    const playerTileY = Math.floor(playerPosition.coordinates.y / gridSize);

    // Check NPCs
    const npcAtPosition = currentLocation.metadata?.npcs?.find(
      (npc) => npc.coordinates.x === playerTileX && npc.coordinates.y === playerTileY
    );
    if (npcAtPosition) {
      setCurrentPOI({ type: "npc", data: npcAtPosition });
      return;
    }

    // Check Shops
    const shopAtPosition = currentLocation.metadata?.shops?.find(
      (shop) => shop.coordinates.x === playerTileX && shop.coordinates.y === playerTileY
    );
    if (shopAtPosition) {
      setCurrentPOI({ type: "shop", data: shopAtPosition });
      return;
    }

    // Check Services
    const serviceAtPosition = currentLocation.metadata?.services?.find(
      (service) => service.coordinates.x === playerTileX && service.coordinates.y === playerTileY
    );
    if (serviceAtPosition) {
      setCurrentPOI({ type: "service", data: serviceAtPosition });
      return;
    }

    // Check Battle Triggers
    const battleAtPosition = currentLocation.metadata?.battleMaps?.find(
      (battle) => battle.coordinates.x === playerTileX && battle.coordinates.y === playerTileY
    );
    if (battleAtPosition) {
      setCurrentPOI({ type: "battle", data: battleAtPosition });
      return;
    }

    // Check Treasures
    const treasureAtPosition = currentLocation.metadata?.treasures?.find(
      (treasure) => treasure.coordinates.x === playerTileX && treasure.coordinates.y === playerTileY
    );
    if (treasureAtPosition) {
      setCurrentPOI({ type: "treasure", data: treasureAtPosition });
      return;
    }

    // No POI at player position
    setCurrentPOI({ type: null, data: null });
  }, [playerPosition, currentLocation, gridSize]);

  // Handle SPACE key press
  useEffect(() => {
    // Interaction handlers (defined inside useEffect)
    const handleNPCInteraction = (npc: NPCMarker) => {
      console.log("🗣️ Talking to NPC:", npc);
      // TODO: Open NPC dialogue modal
      alert(`Talking to ${npc.name || "NPC"}!\n\n${npc.hasQuest ? "This NPC has a quest for you!" : "Hello, traveler!"}`);
    };

    const handleShopInteraction = (shop: ShopMarker) => {
      console.log("🏪 Entering shop:", shop);
      // TODO: Navigate to shop page or open shop modal
      alert(`Entering ${shop.name || "Shop"}!\n\nShop Type: ${shop.shopType || "general"}`);
    };

    const handleServiceInteraction = (service: ServiceMarker) => {
      console.log("🏛️ Using service:", service);
      // TODO: Open service modal
      alert(`Using ${service.name || service.serviceType}!\n\nService: ${service.serviceType}`);
    };

    const handleBattleInteraction = (battle: BattleMarker) => {
      console.log("⚔️ Starting battle:", battle);
      // Navigate to battle page
      router.push(`/battle/${battle.battleMapId}`);
    };

    const handleTreasureInteraction = (treasure: TreasureMarker) => {
      if (treasure.isDiscovered) {
        console.log("💎 Treasure already opened:", treasure);
        alert("This treasure chest has already been opened.");
        return;
      }

      console.log("💎 Opening treasure:", treasure);
      // TODO: Open treasure modal and mark as discovered
      alert(`Opening ${treasure.name || "Treasure"}!\n\nYou found some items!`);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger on SPACE key
      if (event.code !== "Space") return;

      // Prevent default space behavior (page scroll)
      event.preventDefault();

      if (!currentPOI.type || !currentPOI.data) return;

      // Handle interaction based on POI type
      switch (currentPOI.type) {
        case "npc":
          handleNPCInteraction(currentPOI.data as NPCMarker);
          break;
        case "shop":
          handleShopInteraction(currentPOI.data as ShopMarker);
          break;
        case "service":
          handleServiceInteraction(currentPOI.data as ServiceMarker);
          break;
        case "battle":
          handleBattleInteraction(currentPOI.data as BattleMarker);
          break;
        case "treasure":
          handleTreasureInteraction(currentPOI.data as TreasureMarker);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPOI, router]);

  return {
    currentPOI,
    hasInteractablePOI: currentPOI.type !== null,
  };
}

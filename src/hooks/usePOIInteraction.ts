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

interface POIModalsState {
  npcDialogue: { isOpen: boolean; npc: NPCMarker | null };
  shop: { isOpen: boolean; shop: ShopMarker | null };
  service: { isOpen: boolean; service: ServiceMarker | null };
  treasure: { isOpen: boolean; treasure: TreasureMarker | null };
}

export function usePOIInteraction(currentLocation: Location, gridSize: number) {
  const router = useRouter();
  const { playerPosition } = useVirtualMapStore();
  const [currentPOI, setCurrentPOI] = useState<POIAtPlayerPosition>({
    type: null,
    data: null,
  });

  // Modal states
  const [modals, setModals] = useState<POIModalsState>({
    npcDialogue: { isOpen: false, npc: null },
    shop: { isOpen: false, shop: null },
    service: { isOpen: false, service: null },
    treasure: { isOpen: false, treasure: null },
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
      // Open NPC dialogue modal
      setModals((prev) => ({
        ...prev,
        npcDialogue: { isOpen: true, npc },
      }));
    };

    const handleShopInteraction = (shop: ShopMarker) => {
      console.log("🏪 Entering shop:", shop);
      // Open shop modal
      setModals((prev) => ({
        ...prev,
        shop: { isOpen: true, shop },
      }));
    };

    const handleServiceInteraction = (service: ServiceMarker) => {
      console.log("🏛️ Using service:", service);
      // Open service modal
      setModals((prev) => ({
        ...prev,
        service: { isOpen: true, service },
      }));
    };

    const handleBattleInteraction = (battle: BattleMarker) => {
      console.log("⚔️ Starting battle:", battle);
      // Navigate to battle page
      router.push(`/battle/${battle.battleMapId}`);
    };

    const handleTreasureInteraction = (treasure: TreasureMarker) => {
      console.log("💎 Opening treasure:", treasure);
      // Open treasure modal
      setModals((prev) => ({
        ...prev,
        treasure: { isOpen: true, treasure },
      }));
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

  // Modal close handlers
  const closeNPCDialogue = () => {
    setModals((prev) => ({
      ...prev,
      npcDialogue: { isOpen: false, npc: null },
    }));
  };

  const closeShop = () => {
    setModals((prev) => ({
      ...prev,
      shop: { isOpen: false, shop: null },
    }));
  };

  const closeService = () => {
    setModals((prev) => ({
      ...prev,
      service: { isOpen: false, service: null },
    }));
  };

  const closeTreasure = () => {
    setModals((prev) => ({
      ...prev,
      treasure: { isOpen: false, treasure: null },
    }));
  };

  return {
    currentPOI,
    hasInteractablePOI: currentPOI.type !== null,
    modals,
    closeNPCDialogue,
    closeShop,
    closeService,
    closeTreasure,
  };
}

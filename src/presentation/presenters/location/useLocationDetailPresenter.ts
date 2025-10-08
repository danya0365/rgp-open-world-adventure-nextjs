"use client";

import { useEffect, useState } from "react";
import {
  LocationDetailPresenterFactory,
  LocationDetailViewModel,
} from "./LocationDetailPresenter";

const presenter = LocationDetailPresenterFactory.createClient();

/**
 * useLocationDetailPresenter Hook
 * Manages state and business logic for Location Detail UI
 */
export function useLocationDetailPresenter(
  locationId?: string,
  initialViewModel?: LocationDetailViewModel
) {
  const [viewModel, setViewModel] = useState<LocationDetailViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);
  const [battleMapId, setBattleMapId] = useState<string | null>(null);
  const [isBattleActive, setIsBattleActive] = useState(false);

  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
      return;
    }

    if (locationId) {
      loadLocationDetail();
    }
  }, [locationId]);

  const loadLocationDetail = async () => {
    if (!locationId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await presenter.getViewModel(locationId);

      setViewModel(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load location");
      console.error("Error loading location detail:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enter battle with selected map
   */
  const enterBattle = (mapId: string) => {
    console.log("Entering battle with map:", mapId);
    setBattleMapId(mapId);
    setIsBattleActive(true);
  };

  /**
   * Exit battle and return to location
   */
  const exitBattle = () => {
    setIsBattleActive(false);
    setBattleMapId(null);
  };

  /**
   * Start quest from location
   */
  const startQuest = (questId: string) => {
    console.log("Starting quest:", questId);
    // TODO: Implement quest start logic
  };

  /**
   * Talk to NPC
   */
  const talkToNPC = (npcId: string) => {
    console.log("Talking to NPC:", npcId);
    // TODO: Implement NPC dialogue
  };

  /**
   * Access service (Shop, Inn, etc.)
   */
  const accessService = (serviceType: string) => {
    console.log("Accessing service:", serviceType);
    // TODO: Implement service access
  };

  return {
    viewModel,
    loading,
    error,
    battleMapId,
    isBattleActive,
    enterBattle,
    exitBattle,
    startQuest,
    talkToNPC,
    accessService,
    reload: loadLocationDetail,
  };
}

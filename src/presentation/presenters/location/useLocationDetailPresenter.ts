"use client";

import { useState, useEffect } from "react";
import {
  LocationDetailPresenterFactory,
  LocationDetailViewModel,
} from "./LocationDetailPresenter";

/**
 * useLocationDetailPresenter Hook
 * Manages state and business logic for Location Detail UI
 */
export function useLocationDetailPresenter(
  locationId: string,
  initialViewModel?: LocationDetailViewModel
) {
  const [viewModel, setViewModel] = useState<LocationDetailViewModel | null>(
    initialViewModel || null
  );
  const [loading, setLoading] = useState(!initialViewModel);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialViewModel) {
      setViewModel(initialViewModel);
      setLoading(false);
      return;
    }

    loadLocationDetail();
  }, [locationId]);

  const loadLocationDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const presenter = await LocationDetailPresenterFactory.createClient();
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
    // This will be handled by navigation
    console.log("Entering battle with map:", mapId);
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
    enterBattle,
    startQuest,
    talkToNPC,
    accessService,
    reload: loadLocationDetail,
  };
}

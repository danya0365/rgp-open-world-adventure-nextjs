"use client";

import { BattleViewModel } from "@/src/presentation/presenters/battle/BattlePresenter";
import { useEffect, useState } from "react";
import { BattleView } from "./BattleView";

interface ClientBattleViewProps {
  mapId: string;
  initialViewModel?: BattleViewModel;
}

export default function ClientBattleView({
  mapId,
  initialViewModel,
}: ClientBattleViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return <BattleView mapId={mapId} initialViewModel={initialViewModel} />;
}

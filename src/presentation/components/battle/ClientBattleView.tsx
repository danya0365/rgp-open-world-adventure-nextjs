"use client";

import { BattleViewModel } from "@/src/presentation/presenters/battle/BattlePresenter";
import { useEffect, useState } from "react";
import { BattleFullView } from "./BattleFullView";

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
  return <BattleFullView mapId={mapId} initialViewModel={initialViewModel} />;
}
